import { Component, ViewEncapsulation, ElementRef } from "@angular/core";
import { GridOptions } from "ag-grid/main";

// only import this if you are using the ag-Grid-Enterprise
import "ag-grid-enterprise";
import { DateComponent } from "../date-component/date.component";
import { HeaderGroupComponent } from "../header-group-component/header-group.component";
import SkillFilter from "../filters/skillFilter";
import ProficiencyFilter from "../filters/proficiencyFilter";
import RefData from "../data/refData";
import { HeaderComponent } from "../header-component/header.component";
import { DetailCellRendererComponent } from "../../testing/detail-cell-renderer/detail-cell-renderer.component";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {

  private gridOptions: GridOptions;
  public rowData: any[];
  private columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;
  public HeaderGroupComponent = HeaderGroupComponent;

  constructor(private elementRef: ElementRef) {
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{};
    this.createRowData();
    this.createColumnDefs();
    this.gridOptions.dateComponentFramework = DateComponent;
    this.gridOptions.defaultColDef = {
      headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };
    this.gridOptions.getContextMenuItems = this.getContextMenuItems.bind(this);
    this.gridOptions.floatingFilter = true;
  }

  private detailCellRendererParams;

  private getContextMenuItems(): any {
    let result: any = [
      { // custom item
        name: 'Alert ',
        action: function () {
          window.alert('Alerting about ');
        },
        cssClasses: ['redFont', 'bold']
      }];
    return result;
  }

  private callIdSequence: number = 555;
  private images: string[] = ['niall', 'sean', 'alberto', 'statue', 'horse'];

  private createRowData() {
    const rowData: any[] = [];

    for (let i = 0; i < 200; i++) {
      const countryData = RefData.countries[i % RefData.countries.length];

      let firstName = RefData.firstNames[i % RefData.firstNames.length];
      let lastName = RefData.lastNames[i % RefData.lastNames.length];

      let image = this.images[i % this.images.length];

      let totalDuration = 0;

      let callRecords = [];
      // call count is random number between 20 and 120
      let callCount = Math.floor(Math.random() * 100) + 20;
      for (let j = 0; j < callCount; j++) {
        // duration is random number between 20 and 120
        let callDuration = Math.floor(Math.random() * 100) + 20;
        let callRecord = {
          callId: this.callIdSequence++,
          duration: callDuration,
          switchCode: 'SW' + Math.floor(Math.random() * 10),
          // 50% chance of in vs out
          direction: (Math.random() > .5) ? 'In' : 'Out',
          // made up number
          number: '(0' + Math.floor(Math.random() * 10) + ') ' + Math.floor(Math.random() * 100000000)
        };
        callRecords.push(callRecord);
        totalDuration += callDuration;
      }

      rowData.push({
        name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
        skills: {
          android: Math.random() < 0.4,
          html5: Math.random() < 0.4,
          mac: Math.random() < 0.4,
          windows: Math.random() < 0.4,
          css: Math.random() < 0.4
        },
        dob: RefData.DOBs[i % RefData.DOBs.length],
        address: RefData.addresses[i % RefData.addresses.length],
        years: Math.round(Math.random() * 100),
        proficiency: Math.round(Math.random() * 100),
        country: countryData.country,
        continent: countryData.continent,
        language: countryData.language,
        mobile: createRandomPhoneNumber(),
        landline: createRandomPhoneNumber(),
        callRecords: callRecords,
        account: i + 177000,
        totalCalls: callCount,
        image: image,
        // convert from seconds to minutes
        totalMinutes: totalDuration / 60,
      });
    }

    this.rowData = rowData;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        rowDrag: true,
        headerName: '#',
        width: 30,
        checkboxSelection: true,
        suppressSorting: true,
        suppressMenu: true,

        suppressFilter: true
      },
      {
        headerName: 'Employee',
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          {
            headerName: "Name",
            field: "name",
            width: 150,
            cellRenderer: 'group',
            cellRendererParams: { suppressCount: true },
          },
          {
            headerName: "Country",
            field: "country",
            width: 150,
            cellRenderer: countryCellRenderer,

            filterParams: {
              cellRenderer: countryCellRenderer,
              cellHeight: 20
            }
          },
          {
            headerName: "Date of Birth",
            field: "dob",
            width: 170,

            cellRenderer: function (params) {
              return pad(params.value.getDate(), 2) + '/' +
                pad(params.value.getMonth() + 1, 2) + '/' +
                params.value.getFullYear();
            },
            filter: 'date',
            columnGroupShow: 'open'
          }
        ]
      },
      {
        headerName: 'IT Skills',
        children: [
          {
            headerName: "Skills",
            width: 125,
            suppressSorting: true,
            cellRenderer: skillsCellRenderer,
            filter: SkillFilter
          },
          {
            headerName: "Proficiency",
            field: "proficiency",
            width: 150,
            cellRenderer: percentCellRenderer,
            filter: ProficiencyFilter
          },
        ]
      },
      {
        headerName: 'Contact',
        children: [
          { headerName: "Mobile", field: "mobile", width: 150, filter: 'text' },
          { headerName: "Land-line", field: "landline", width: 150, filter: 'text' },
          { headerName: "Address", field: "address", width: 500, filter: 'text' }
        ]
      }
    ];

    // this.detailCellRendererParams = {
    //   detailGridOptions: {
    //     columnDefs: [
    //       { field: "callId" },
    //       { field: "direction" },
    //       { field: "number" },
    //       {
    //         field: "duration",
    //         valueFormatter: "x.toLocaleString() + 's'"
    //       },
    //       { field: "switchCode" }
    //     ],
    //     onGridReady: function (params) {
    //       params.api.sizeColumnsToFit();
    //     }
    //   },
    //   getDetailRowData: function (params) {
    //     params.successCallback(params.data.callRecords);
    //   }
    // };

  }

  public getRowHeight(params) {
    var rowIsDetailRow = params.node.level === 1;
    // return 100 when detail row, otherwise return 25
    return rowIsDetailRow ? 200 : 25;
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      const model = this.gridOptions.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  private onModelUpdated() {
    console.log('onModelUpdated');
    this.calculateRowCount();
  }

  private onReady() {
    console.log('onReady');
    this.calculateRowCount();
  }

  private onCellClicked($event) {
    console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellValueChanged($event) {
    console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  private onCellDoubleClicked($event) {
    console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellContextMenu($event) {
    console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellFocused($event) {
    console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  private onRowSelected($event) {
    // taking out, as when we 'select all', it prints to much to the console!!
    // console.log('onRowSelected: ' + $event.node.data.name);
  }

  public selectedRowsCount: number = 0;

  private onSelectionChanged() {
    console.log('selectionChanged');
    this.selectedRowsCount = this.gridOptions.api.getSelectedRows().length;
    console.log(this.selectedRowsCount);
  }

  private onFilterModified() {
    console.log('onFilterModified');
  }

  private onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  private onRowClicked($event) {
    console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  private onColumnEvent($event) {
    console.log('onColumnEvent: ' + $event);
  }

  public dobFilter() {
    let dateFilterComponent = this.gridOptions.api.getFilterInstance('dob');
    dateFilterComponent.setModel({
      type: 'equals',
      dateFrom: '2000-01-01'
    });
    this.gridOptions.api.onFilterChanged();
  }


  public getNodeChildDetails(record) {
    if (record.callRecords) {
      return {
        group: true,
        // the key is used by the default group cellRenderer
        key: record.name,
        // provide ag-Grid with the children of this group
        children: [record.callRecords],
        // for demo, expand the third row by default
        expanded: record.account === 177000
      };
    } else {
      return null;
    }
  }

  public isFullWidthCell(rowNode) {
    return rowNode.level === 1;
  }

  public getFullWidthCellRenderer() {
    return DetailCellRendererComponent;
  }
}

function skillsCellRenderer(params) {
  const data = params.data;
  const skills = [];
  RefData.IT_SKILLS.forEach(function (skill) {
    if (data && data.skills && data.skills[skill]) {
      skills.push('<img src="https://www.ag-grid.com/images/skills/' + skill + '.png" width="16px" title="' + skill + '" />');
    }
  });
  return skills.join(' ');
}

function countryCellRenderer(params) {
  const flag = "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='https://www.ag-grid.com/images/flags/" + RefData.COUNTRY_CODES[params.value] + ".png'>";
  return flag + " " + params.value;
}

function createRandomPhoneNumber() {
  let result = '+';
  for (let i = 0; i < 12; i++) {
    result += Math.round(Math.random() * 10);
    if (i === 2 || i === 5 || i === 8) {
      result += ' ';
    }
  }
  return result;
}

function percentCellRenderer(params) {
  const value = params.value;

  const eDivPercentBar = document.createElement('div');
  eDivPercentBar.className = 'div-percent-bar';
  eDivPercentBar.style.width = value + '%';
  if (value < 20) {
    eDivPercentBar.style.backgroundColor = 'red';
  } else if (value < 60) {
    eDivPercentBar.style.backgroundColor = '#ff9900';
  } else {
    eDivPercentBar.style.backgroundColor = '#00A000';
  }

  const eValue = document.createElement('div');
  eValue.className = 'div-percent-value';
  eValue.innerHTML = value + '%';

  const eOuterDiv = document.createElement('div');
  eOuterDiv.className = 'div-outer-div';
  eOuterDiv.appendChild(eValue);
  eOuterDiv.appendChild(eDivPercentBar);

  return eOuterDiv;
}

//Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
  let asString = num + "";
  while (asString.length < totalStringSize) asString = "0" + asString;
  return asString;
}

