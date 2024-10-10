import { Component, OnInit } from '@angular/core';
import {
  ChipChangeEvent,
  DropdownChangeEvent,
  DropdownLoadEvent,
  DropdownMenuItem,
} from '../../../../projects/verben-ng-ui/src/public-api';

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
  selector: 'app-dropdown-sample',
  templateUrl: './dropdown-sample.component.html',
  styleUrl: './dropdown-sample.component.scss',
})
export class DropdownSampleComponent implements OnInit {
  chipValues: string[] = ['try', 'to'];
  basicChip: string[] = [];

  options: string[] = [
    'Opt 1',
    'Opt 2',
    'Opt 3yewwwwwweuweyweueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  ];
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

  missingObject: TestParentObject = {
    Id: '5',
    Name: 'Akintunde',
  };

  selectedParent?: string;

  testParentsSearch: TestParentObject[] = [
    { Id: '1', Name: 'Jimly' },
    { Id: '2', Name: 'Jecil' },
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
  testChildObjectsSearch: TestChildObject[] = [
    { ParentId: '1', Id: '1', Name: 'Chukwunonso' },
    { ParentId: '1', Id: '2', Name: 'Olorunfemi' },
    { ParentId: '2', Id: '3', Name: 'Chibueze' },
  ];

  optionsThree: DropdownMenuItem[] = this.testParents.map((x) => {
    return {
      label: x.Name,
      subLabel: 'First Name',
      value: x,
      items: this.testChildObjects
        .filter((y) => y.ParentId == x.Id)
        .map((z) => {
          return {
            label: z.Name,
            subLabel: 'Other Names',
            value: z,
          };
        }),
      loadMore: async (context: DropdownLoadEvent) => {
        return await this.loadChildren(context, x.Id);
      },
    };
  });

  optionsFour: DropdownMenuItem[] = this.testParents.map((x) => {
    return {
      label: x.Name,
      subLabel: 'First Name',
      value: x,
      items: [],
      lazyLoad: true,
      search: async (param: string, context: DropdownLoadEvent) => {
        return await this.searchItemsChild(param, context, x.Id);
      },
      loadMore: async (context: DropdownLoadEvent) => {
        return await this.loadChildrenTwo(context, x.Id);
      },
    };
  });

  basicOption?: string;
  selectedOption: string[] = [];
  selectedOptionTwo: string[] = [];
  selectedOptionThree?: string;
  selectedOptionFour?: TestChildObject;
  selectedOptionFive?: TestChildObject;
  selectedOptionSix?: TestChildObject[];

  constructor() {}

  getParentLabel(context: any): string {
    console.log({ MissingObj: this.missingObject });
    return this.missingObject.Name;
  }

  clearSelection() {
    this.basicOption = '';
  }

  ngOnInit(): void {
    this.selectedParent = '1';
    this.selectedOption = ['Opt 1'];
    this.selectedOptionTwo = ['1'];
    // this.selectedOptionThree = {
    //   ParentId: '1',
    //   Id: '1',
    //   Name: 'Chukwunonso',
    // };
    this.selectedOptionSix = [
      {
        ParentId: '1',
        Id: '1',
        Name: 'Chukwunonso',
      },
      { ParentId: '2', Id: '3', Name: 'Chibueze' },
    ];
    this.selectedOptionThree = '1';
  }

  onChipChange(event: ChipChangeEvent) {
    console.log({
      'Basic Chip': this.basicChip,
      'Chip. Max 10. Templated item': this.chipValues,
    });
  }

  onDropdownChange(event: DropdownChangeEvent): void {
    // console.log({
    //   'Test Parent Value': this.selectedParent,
    //   'Basic Dropdown. Single Select. No Group': this.basicOption,
    //   'Single select. Grouped. Option Value Id': this.selectedOptionThree,
    //   'Single select. Grouped. Paged parents.': this.selectedOptionFour,
    //   'Single select. Grouped. No pagination': this.selectedOptionFive,
    //   'Multiselect, No group, Not paged. Select All Allowed. Filter on. Default view':
    //     this.selectedOption,
    //   'Multiselect, No group, Not paged. Select All Allowed. Filter on. Chip view':
    //     this.selectedOption,
    //   'Multiselect, No group. Option Value Id': this.selectedOptionTwo,
    //   'Multiselect. No group. Templated': this.selectedOption,
    //   'Multiselect multiple nested paged content. Filter off':
    //     this.selectedOptionSix,
    //   'Multiselect multiple nested paged content. Filter on':
    //     this.selectedOptionSix,
    // });
  }

  async mockAsyncFunction(event: DropdownLoadEvent): Promise<string[]> {
    console.log({ LoadEvent: event });
    return await new Promise((resolve) =>
      setTimeout(() => resolve(['Option 1', 'Option 2', 'Option 3']), 3000)
    );
  }

  async loadMoreParents(event: DropdownLoadEvent): Promise<TestParentObject[]> {
    console.log({ ParentLoadEvent: JSON.parse(JSON.stringify(event)) });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { Id: '1', Name: 'Jimly' },
            { Id: '2', Name: 'Jecil' },
            { Id: '3', Name: 'Jelom' },
            { Id: '4', Name: 'Jemima' },
            { Id: '5', Name: 'Akintunde' },
          ]),
        3000
      )
    );
  }

  async searchParents(
    param: string,
    event: DropdownLoadEvent
  ): Promise<TestParentObject[]> {
    console.log({
      Param: param,
      ParentLoadEvent: JSON.parse(JSON.stringify(event)),
    });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { Id: '3', Name: 'Jelom' },
            { Id: '4', Name: 'Jemima' },
          ]),
        3000
      )
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
    console.log('Parent load more called');
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
                  // subLabel: 'Other Names',
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
    console.log('Child Load More called');
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
                  filterBy: 'Name',
                  items: this.testChildObjects
                    .filter((z) => z.ParentId == id)
                    .map((u) => {
                      return {
                        label: u.Name,
                        // subLabel: 'Other Names',
                        value: u,
                      };
                    }),
                };
              })
          ),
        3000
      )
    );
  }

  async searchItems(
    param: string,
    event: DropdownLoadEvent
  ): Promise<DropdownMenuItem[]> {
    console.log('Parent search called');
    console.log({ LoadEventNested: event });
    console.log({ Param: param });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.testParentsSearch.map((x) => {
              return {
                label: x.Name,
                subLabel: 'First Name',
                value: x,
                items: [],
                search: async (param: string, context: DropdownLoadEvent) => {
                  return await this.searchItemsChild(param, context, x.Id);
                },
                lazyLoad: true,
                loadMore: async (context: DropdownLoadEvent) => {
                  return await this.loadChildrenTwo(context, x.Id);
                },
              };
            })
          ),
        3000
      )
    );
  }
  async searchItemsChild(
    param: string,
    event: DropdownLoadEvent,
    id: string
  ): Promise<DropdownMenuItem[]> {
    console.log('Child search called');
    console.log({ LoadEventNestedChild: event });
    console.log({ ParamChild: param });
    return await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.testChildObjectsSearch
              .filter((x) => x.ParentId == id)
              .map((y) => {
                return {
                  label: y.Name,
                  value: y,
                  filterBy: 'Name',
                  items: this.testChildObjects
                    .filter((z) => z.ParentId == id)
                    .map((u) => {
                      return {
                        label: u.Name,
                        // subLabel: 'Other Names',
                        value: u,
                      };
                    }),
                };
              })
          ),
        3000
      )
    );
  }

  getAsyncLabel(context: string): string | null {
    const index = this.testChildObjects.findIndex((x) => x.Id == context);
    return index > -1 ? this.testChildObjects[index].Name : null;
  }

  getAsyncLabelTwo(context: string): string | null {
    const index = this.optionsTwo.findIndex((x) => x.Id == context);
    return index > -1 ? this.optionsTwo[index].Name : null;
  }
  getAsyncLabelObject(context: TestChildObject): string | null {
    return context.Name;
  }
}
