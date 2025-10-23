import { inject, Component, OnInit } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { Mission } from 'models/mission';
import { MissionService } from 'services/mission-service/mission.service';
import { RocketService } from 'services/rocket-service/rocket.service';
/**
 * ReportComponent is an Angular component that creates reports.
 */
@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrl: './report.component.css',
  imports: [MatButtonModule, MatFabButton, MatCardModule, MatIconModule, MatTabsModule],
})
export class ReportComponent implements OnInit {
  private missionService: MissionService = inject(MissionService);
  private rocketService: RocketService = inject(RocketService);
  missions: Mission[] = [];
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   * @returns void
   */
  async ngOnInit() {
    this.missions = this.missionService.getMissions();
    pdfMake.vfs = pdfFonts.vfs;
    console.log('🟨ReportComponent.ngOnInit():');
  }
  /**
   * Generates the PDF file.
   * @param content
   * @param action
   * @returns void
   */
  generatePdf(
    action: string
  ): void {
    const documentDefinition = this.createDocumentDefinitionForMissionsAndRockets() as import('pdfmake/interfaces').TDocumentDefinitions;
    const tCreatedPdf = pdfMake.createPdf(documentDefinition);
    switch (action) {
      case 'open':
        tCreatedPdf.open();
        break;
      case 'print':
        tCreatedPdf.print();
        break;
      case 'download':
        tCreatedPdf.download();
        break;
      default:
        tCreatedPdf.open();
        break;
    }
    console.log('🟨ReportComponent.generatePdf(): action[%s]', action);
  }
  /**
   * Creates document definition for missions and rockets.
   * @returns TDocumentDefinitions
   */
  private createDocumentDefinitionForMissionsAndRockets() {
    return {
      content: [
        {
          text: 'Missions and Rockets Report',
          style: 'header',
          margin: [0, 0, 0, 20],
          alignment: 'center',
        },
        {
          table: {
            body: this.loadMissionTable(),
          },
          alignment: 'justify',
        },
      ],
      info: {
        title: 'Missions and Rockets Report',
        author: 'k1729p',
        subject: 'Missions and Rockets',
        keywords: 'report',
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }
  /**
   * Loads the table with the missions, sorted by the number of rockets (descending),
   * and alphabetically (descending) for missions with the same number of rockets.
   * @returns missionTable
   */
  private loadMissionTable(): (
    | string
    | number
    | boolean
    | Record<string, unknown>
  )[][] {
    type TableCell = string | number | boolean | Record<string, unknown>;
    const missionTable: TableCell[][] = [];

    // Add table headers
    missionTable.push([
      {
        text: 'Mission',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lightcyan',
      },
      {
        text: 'Mission Status',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lightcyan',
      },
      {
        text: 'Number Of Rockets',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lightcyan',
      },
      {
        text: 'Rocket',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lavenderblush',
      },
      {
        text: 'Rocket Status',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lavenderblush',
      },
    ]);

    const sortedMissions = [...this.missions].sort((a, b) => {
      const rocketsA = this.rocketService.getRockets(a.id).length;
      const rocketsB = this.rocketService.getRockets(b.id).length;
      if (rocketsA !== rocketsB) {
        return rocketsB - rocketsA;
      }
      return a.name.localeCompare(b.name);
    });

    for (const mission of sortedMissions) {
      const rockets = this.rocketService.getRockets(mission.id);
      if (rockets.length === 0) {
        missionTable.push([
          {
            text: mission.name,
            rowSpan: 1,
          },
          {
            text: mission.missionStatus,
            rowSpan: 1,
          },
          {
            text: rockets.length,
            rowSpan: 1,
          },
          {
            text: '-',
          },
          {
            text: '-',
          },
        ]);
      } else {
        rockets.forEach((rocket, idx) => {
          if (idx === 0) {
            missionTable.push([
              {
                text: mission.name,
                rowSpan: rockets.length,
              },
              {
                text: mission.missionStatus,
                rowSpan: rockets.length,
              },
              {
                text: rockets.length,
                rowSpan: rockets.length,
              },
              rocket.name,
              rocket.rocketStatus,
            ]);
          } else {
            missionTable.push([
              '',
              '',
              '',
              rocket.name,
              rocket.rocketStatus,
            ]);
          }
        });
      }
    }
    return missionTable;
  }
}
