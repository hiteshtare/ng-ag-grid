import { Component, ViewChild, AfterViewInit } from "@angular/core";
import "ag-grid-enterprise";
import { DetailCellRendererComponent } from './../detail-cell-renderer/detail-cell-renderer.component';
import { GridOptions } from "ag-grid/main";

@Component({
  selector: 'app-required',
  templateUrl: './required.component.html',
  styleUrls: ['./required.component.css']
})
export class RequiredComponent implements AfterViewInit {
  public gridOptions: GridOptions;
  private rowSelection;

  constructor() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.createRowData();
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.rowSelection = "multiple";
    this.gridOptions.animateRows = true;
    this.gridOptions.floatingFilter = true;
  }

  private createColumnDefs() {
    return [
      {
        rowDrag: true,
        headerName: '#',
        minWidth: 10,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: 'Name', field: 'name',
        // left column is going to act as group column, with the expand / contract controls
        cellRenderer: 'group',
        // we don't want the child count - it would be one each time anyway as each parent
        // not has exactly one child node
        cellRendererParams: { suppressCount: true },
        minWidth: 100,
        editable: true
      },
      {
        headerName: 'Account', field: 'account', cellEditor: "numericEditor",
        editable: true,
        minWidth: 100
      },
      {
        headerName: 'Calls', field: 'totalCalls', cellEditor: "numericEditor",
        editable: true,
        minWidth: 50
      },
      { headerName: 'Minutes', field: 'totalMinutes', valueFormatter: this.minuteCellFormatter, minWidth: 50 }
    ];
  }

  // Sometimes the gridReady event can fire before the angular component is ready to receive it, so in an angular
  // environment its safer to on you cannot safely rely on AfterViewInit instead before using the API
  ngAfterViewInit() {
    //this.gridOptions.api.sizeColumnsToFit();
  }

  private getContextMenuItems;

  private gridColumnApi;
  private gridApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  public getRowHeight(params) {
    var rowIsDetailRow = params.node.level === 1;
    // return 100 when detail row, otherwise return 25
    return rowIsDetailRow ? 200 : 25;
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

  private createRowData() {
    let rowData: any[] = [];

    for (let i = 0; i < 20; i++) {
      let firstName = this.firstnames[Math.floor(Math.random() * this.firstnames.length)];
      let lastName = this.lastnames[Math.floor(Math.random() * this.lastnames.length)];

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

      let record = {
        name: firstName + ' ' + lastName,
        account: i + 177000,
        totalCalls: callCount,
        image: image,
        // convert from seconds to minutes
        totalMinutes: totalDuration / 60,
        callRecords: callRecords
      };
      rowData.push(record);
    }

    return rowData;
  }

  private minuteCellFormatter(params) {
    return params.value.toLocaleString() + 'm';
  };

  public selectedRowsCount: number = 0;

  private onSelectionChanged() {
    console.log('selectionChanged');
    this.selectedRowsCount = this.gridOptions.api.getSelectedRows().length;
    console.log(this.selectedRowsCount);
  }

  private onFilterModified() {
    console.log('onFilterModified');
  }

  private toggleSelection() {
    this.gridOptions.api.forEachNode((rowNode) => {
      if (rowNode.isSelected()) {
        rowNode.setSelected(false, false);
      } else {
        rowNode.setSelected(true);
      }
    });
  }

  public onGridSizeChanged(params) {
    var gridWidth = document.getElementById("grid-wrapper").offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = this.gridOptions.columnApi.getAllColumns();
    for (var i = 0; i < allColumns.length; i++) {
      let column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      let colDef = column.getColDef();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(colDef.headerName);
      } else {
        columnsToShow.push(colDef.headerName);
      }
    }
    this.gridOptions.columnApi.setColumnsVisible(columnsToShow, true);
    this.gridOptions.columnApi.setColumnsVisible(columnsToHide, false);
    this.gridOptions.api.sizeColumnsToFit();
    //debugger;
  }

  // a list of names we pick from when generating data
  private firstnames: string[] = ['Sophia', 'Emma', 'Olivia', 'Isabella', 'Mia', 'Ava', 'Lily', 'Zoe', 'Emily', 'Chloe', 'Layla', 'Madison', 'Madelyn', 'Abigail', 'Aubrey', 'Charlotte', 'Amelia', 'Ella', 'Kaylee', 'Avery', 'Aaliyah', 'Hailey', 'Hannah', 'Addison', 'Riley', 'Harper', 'Aria', 'Arianna', 'Mackenzie', 'Lila', 'Evelyn', 'Adalyn', 'Grace', 'Brooklyn', 'Ellie', 'Anna', 'Kaitlyn', 'Isabelle', 'Sophie', 'Scarlett', 'Natalie', 'Leah', 'Sarah', 'Nora', 'Mila', 'Elizabeth', 'Lillian', 'Kylie', 'Audrey', 'Lucy', 'Maya'];
  private lastnames: string[] = ['Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Johnson'];

  private images: string[] = ['niall', 'sean', 'alberto', 'statue', 'horse'];

  // each call gets a unique id, nothing to do with the grid, just help make the sample
  // data more realistic
  private callIdSequence: number = 555;


}
