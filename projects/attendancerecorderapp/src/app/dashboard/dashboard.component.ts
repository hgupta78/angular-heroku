import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { AttendancerecorderService } from '../attendancerecorder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors: Array < any > = [{
    backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3), rgba(196,79,244,0.3)'],
    borderColor: ['rgba(135,206,250,1)', 'rgba(106,90,205,1)', 'rgba(148,159,177,1), rgba(196,79,244,0.3)']
 }];
  public pieChartPlugins = [];
  totalCount = 0;
  totalCountPresent = 0;
  nationalTotalCount = 0;
  stateTotalCount= 0;
  
  nationalTotalPresentCount = 0;
  stateTotalPresentCount= 0;
  
  dataList = [];
  attendanceInquriy: any;
  constructor(private attendancerecorderService: AttendancerecorderService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.attendancerecorderService.getProductList().subscribe((response) => {
      this.dataList = response;
    })
    this.attendancerecorderService.getAttendanceInquiry().subscribe((response) => {
      this.attendanceInquriy = response;
      this.totalCount = response.total;
      this.processResponseTotalCount(this);
      this.processResponse(this);
    })
    this.getAttendanceInquriyInterval();
  }

  getAttendanceInquriyInterval() {
    var vm = this;
    setInterval(function () {
      vm.attendancerecorderService.getAttendanceInquiry().subscribe((response) => {
        vm.attendanceInquriy = response;
        vm.totalCount = response.total;
        vm.processResponse(vm);
      })
    }, 10000);

  }
processResponseTotalCount(vm) {
   vm.nationalTotalCount = 0;
  vm.stateTotalCount = 0
    vm.attendanceInquriy.totalList.forEach(element => {
      if (element) {
        if (element.name.toLowerCase() == 'national') {
          vm.nationalTotalCount = element.count;
        } else {
          vm.stateTotalCount += element.count;
        }

      }
    });
  }
  processResponse(vm) {
    vm.pieChartLabels = [];
    vm.pieChartData = []
    vm.totalCountPresent = 0;
    vm.nationalTotalPresentCount = 0;
  vm.stateTotalPresentCount= 0;
    
    vm.attendanceInquriy.list.forEach(element => {
      if (element) {
        if (element.name.toLowerCase() == 'national') {
          vm.pieChartLabels.push('Internal');
          vm.nationalTotalPresentCount = element.count;
        } else {
          vm.pieChartLabels.push(element.name);
           vm.stateTotalPresentCount += element.count;
        }

        vm.pieChartData.push(element.count);
        vm.totalCountPresent += element.count;
      }
    });
  }

}
