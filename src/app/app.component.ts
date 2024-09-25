import { Component } from '@angular/core';
import {
  DropdownChangeEvent,
  DropdownMenuItem,
} from '../../projects/verben-ng-ui/src/lib/public-api';
import { DropdownLoadEvent } from '../../projects/verben-ng-ui/src/lib/public-api';

interface TestDropdownObject {
  Id: string;
  Name: string;
}

interface TestParentObject {
  Id: string;
  Name: string;
}

interface TestChildObject {
  ParentId: string;
  Id: string;
  Name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'verben-ui';

  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  optionsTwo: TestDropdownObject[] = [
    { Id: '1', Name: 'One' },
    { Id: '2', Name: 'Two' },
    { Id: '3', Name: 'Three' },
    { Id: '4', Name: 'Four' },
  ];

  testParents: TestParentObject[] = [
    { Id: '1', Name: 'Jimly' },
    { Id: '2', Name: 'Jecil' },
    { Id: '3', Name: 'Jelom' },
    { Id: '4', Name: 'Jemima' },
  ];

  testChildObjects: TestChildObject[] = [
    { ParentId: '1', Id: '1', Name: 'Chukwunonso' },
    { ParentId: '1', Id: '2', Name: 'Olorunfemi' },
    { ParentId: '2', Id: '3', Name: 'Chibueze' },
    { ParentId: '2', Id: '4', Name: 'Ayodoele' },
    { ParentId: '3', Id: '5', Name: 'Ekenedilichukwu' },
    { ParentId: '3', Id: '6', Name: 'Akintunde' },
    { ParentId: '4', Id: '7', Name: 'Chineyenwa' },
    { ParentId: '4', Id: '8', Name: 'Funmi' },
  ];

  optionsThree: DropdownMenuItem[] = this.testParents.map((x) => {
    return {
      label: x.Name,
      subLabel: 'First Name',
      value: x,
      items: [],
      lazyLoad: true,
      loadMore: async (context: DropdownLoadEvent) => {
        return await this.loadChildren(context, x.Id);
      },
      loadTimes: new DropdownLoadEvent(),
    };
  });

  optionsFour: DropdownMenuItem[] = this.testParents.map((x) => {
    return {
      label: x.Name,
      subLabel: 'First Name',
      value: x,
      items: [],
      lazyLoad: true,
      loadMore: async (context: DropdownLoadEvent) => {
        return await this.loadChildrenTwo(context, x.Id);
      },
      loadTimes: new DropdownLoadEvent(),
    };
  });
  selectedOption?: string;
  selectedOptionTwo?: string;
  selectedOptionThree?: string;
  selectedOptionFour?: TestChildObject;
  selectedOptionFive?: TestChildObject;
  selectedOptionSix?: TestChildObject;

  onDropdownChange(event: DropdownChangeEvent): void {
    console.log({ Value: event.value });
    console.log({ FormvalueThree: this.selectedOptionThree });
    console.log({ FormvalueFour: this.selectedOptionFour });
    console.log({ FormvalueFive: this.selectedOptionFive });
    console.log({ FormvalueSix: this.selectedOptionSix });
  }

  async mockAsyncFunction(event: DropdownLoadEvent): Promise<string[]> {
    console.log({ LoadEvent: event });
    return await new Promise((resolve) =>
      setTimeout(() => resolve(['Option 1', 'Option 2', 'Option 3']), 3000)
    );
  }

  async mockAsyncFunctionTwo(
    event: DropdownLoadEvent
  ): Promise<TestDropdownObject[]> {
    console.log({ LoadEvent: event });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { Id: '1', Name: 'One' },
            { Id: '2', Name: 'Two' },
            { Id: '3', Name: 'Three' },
            { Id: '4', Name: 'Four' },
          ]),
        3000
      )
    );
  }

  async mockAsyncFunctionThree(
    event: DropdownLoadEvent
  ): Promise<DropdownMenuItem[]> {
    console.log({ LoadEvent: event });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.testParents.map((x) => {
              return {
                label: x.Name,
                subLabel: 'First Name',
                value: x,
                items: [],
                lazyLoad: true,
                loadMore: async (context: DropdownLoadEvent) => {
                  return await this.loadChildren(context, x.Id);
                },
                loadTimes: new DropdownLoadEvent(),
              };
            })
          ),
        3000
      )
    );
  }

  async mockAsyncFunctionFour(
    event: DropdownLoadEvent
  ): Promise<DropdownMenuItem[]> {
    console.log({ LoadEvent: event });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.testParents.map((x) => {
              return {
                label: x.Name,
                subLabel: 'First Name',
                value: x,
                items: [],
                lazyLoad: true,
                loadMore: async (context: DropdownLoadEvent) => {
                  return await this.loadChildrenTwo(context, x.Id);
                },
                loadTimes: new DropdownLoadEvent(),
              };
            })
          ),
        3000
      )
    );
  }

  async loadChildren(
    event: DropdownLoadEvent,
    id: string
  ): Promise<DropdownMenuItem[]> {
    console.log({ LoadEventNested: event });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.testChildObjects
              .filter((x) => x.ParentId == id)
              .map((y) => {
                return {
                  label: y.Name,
                  subLabel: 'Other Names',
                  value: y,
                };
              })
          ),
        3000
      )
    );
  }

  async loadChildrenTwo(
    event: DropdownLoadEvent,
    id: string
  ): Promise<DropdownMenuItem[]> {
    console.log({ LoadEventNested: event });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.testChildObjects
              .filter((x) => x.ParentId == id)
              .map((y) => {
                return {
                  label: y.Name,
                  value: y,
                  items: [],
                  lazyLoad: true,
                  loadMore: async (context: DropdownLoadEvent) => {
                    return await this.loadChildren(context, id);
                  },
                  loadTimes: new DropdownLoadEvent(),
                };
              })
          ),
        3000
      )
    );
  }
}
