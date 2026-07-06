/**
 * Lean, consumer-facing theme configuration.
 *
 * Every field is optional and maps to a core `--vbn-*` CSS custom property
 * (see `styles/theme.css`). Anything omitted keeps its shipped default, so a
 * consumer typically sets only a handful of values. For fine-grained control of
 * component-level tokens, use the `tokens` escape hatch with raw `--vbn-*` names.
 */
export interface VerbenThemeConfig {
  color?: {
    /** Brand color. Maps to --vbn-color-primary. */
    primary?: string;
    /** Text/icon color shown on top of `primary`. Maps to --vbn-color-on-primary. */
    onPrimary?: string;
    secondary?: string;
    onSecondary?: string;
    /** Component background. Maps to --vbn-color-surface. */
    surface?: string;
    /** Alternate surface for striping/hover/subtle fills. Maps to --vbn-color-surface-alt. */
    surfaceAlt?: string;
    /** Page/overlay base. Maps to --vbn-color-background. */
    background?: string;
    text?: string;
    textMuted?: string;
    border?: string;
    /** Focus ring / focused-border color. Maps to --vbn-color-border-focus. */
    borderFocus?: string;
    success?: string;
    warning?: string;
    /** Error / danger color. Maps to --vbn-color-error. */
    error?: string;
    info?: string;
    /** Modal/overlay backdrop. Maps to --vbn-color-scrim. */
    scrim?: string;
  };
  typography?: {
    fontFamily?: string;
    /** Base font size. Maps to --vbn-font-size-base. */
    fontSize?: string;
  };
  /** Base border radius. Maps to --vbn-radius. */
  radius?: string;
  shadow?: {
    sm?: string;
    md?: string;
  };
  /** Initial color mode. Defaults to 'light'. */
  mode?: ThemeMode;
  /**
   * Raw token overrides — keys are full CSS custom property names (with or
   * without the leading `--`), values are CSS values. Use this for component
   * tokens that have no lean alias, e.g. `{ '--vbn-table-header-bg': '#222' }`.
   */
  tokens?: Record<string, string>;
}

export type ThemeMode = 'light' | 'dark';
