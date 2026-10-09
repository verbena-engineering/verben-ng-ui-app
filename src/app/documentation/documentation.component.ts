import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ThemeService } from 'verben-ng-ui';
import { DOCS_NAV, DocsNavGroup, DocsNavItem, PLAYGROUND_PAGES } from './docs-registry';

interface TocEntry {
  id: string;
  text: string;
  sub: boolean;
}

const THEME_KEY = 'vbn-theme'; // same key the library's [appThemeSwitcher] uses

/**
 * Docs shell: sticky header, sidebar navigation, page outlet and the
 * "On this page" list. Every docs route renders inside this component.
 */
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
})
export class DocumentationComponent implements OnInit, OnDestroy {
  readonly repoUrl = 'https://github.com/verbena-engineering/verben-ng-ui-app';

  groups: DocsNavGroup[] = DOCS_NAV;
  query = '';
  navOpen = false;
  isDark = false;
  isWide = false;
  /** The playground page on screen (framed with Preview | Code), if any */
  playgroundPage?: DocsNavItem;
  toc: TocEntry[] = [];
  activeId = '';

  private sub?: Subscription;

  constructor(
    private router: Router,
    private theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.isDark = this.readTheme() === 'dark';
    this.theme.setMode(this.isDark ? 'dark' : 'light');

    this.onRouteChange(this.router.url);
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.onRouteChange(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Sidebar filtered by the search box (groups with no match disappear) */
  get filteredGroups(): DocsNavGroup[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.groups.filter((g) => g.items.length > 0);
    return this.groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.title.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }

  toggleTheme(): void {
    this.isDark = this.theme.toggleMode() === 'dark';
    try {
      localStorage.setItem(THEME_KEY, this.isDark ? 'dark' : 'light');
    } catch {
      /* storage unavailable — the toggle still works for this visit */
    }
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.activeId = id;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    // The last heading above the top of the viewport is the "current" one
    let current = this.toc[0]?.id ?? '';
    for (const entry of this.toc) {
      const el = document.getElementById(entry.id);
      if (el && el.getBoundingClientRect().top < 120) current = entry.id;
    }
    this.activeId = current;
  }

  @HostListener('document:keydown.escape')
  closeNav(): void {
    this.navOpen = false;
  }

  private onRouteChange(url: string): void {
    const path = url.split(/[?#]/)[0];
    this.playgroundPage = PLAYGROUND_PAGES.find((p) => p.route === path);
    this.navOpen = false;
    // The home grid and the old test pages (own layouts) use the full width
    this.isWide =
      path === '/documentation' ||
      PLAYGROUND_PAGES.some((p) => p.route === path);
    window.scrollTo({ top: 0 });
    // Wait for the new page to render before collecting its headings
    setTimeout(() => requestAnimationFrame(() => this.buildToc()));
  }

  private buildToc(): void {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.docs-content h2[id], .docs-content h3[id]',
      ),
    ).filter((h) => h.id);
    this.toc = headings.map((h) => ({
      id: h.id,
      text: h.textContent?.trim() ?? '',
      sub: h.tagName === 'H3',
    }));
    this.activeId = this.toc[0]?.id ?? '';
  }

  private readTheme(): string | null {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }
}
