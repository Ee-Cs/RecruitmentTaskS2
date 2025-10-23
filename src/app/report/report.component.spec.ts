import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';

import { ReportComponent } from './report.component';
import * as testData from 'testing/test-data';
import { MissionService } from 'services/mission-service/mission.service';
import { RocketService } from 'services/rocket-service/rocket.service';
/**
 * Unit tests for the ReportComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let missionServiceSpy: jasmine.SpyObj<MissionService>;
  let rocketServiceSpy: jasmine.SpyObj<RocketService>;

  /**
   * Set up the testing module for ReportComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(async () => {
    missionServiceSpy = jasmine.createSpyObj('MissionService', ['getMissions']);
    rocketServiceSpy = jasmine.createSpyObj('RocketService', ['getRockets']);

    missionServiceSpy.getMissions.and.callFake(() => [...testData.TEST_MISSIONS]);
    rocketServiceSpy.getRockets.and.callFake((missionId: number) => {
      const mission = testData.TEST_MISSIONS.find(dep => dep.id === missionId);
      return mission ? mission.rockets : [];
    });

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
        { provide: MissionService, useValue: missionServiceSpy },
        { provide: RocketService, useValue: rocketServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the ReportComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the reports page is rendered.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    // Title
    expect(compiled.textContent).toContain('Reports');
    // Buttons
    const openBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Open PDF'));
    expect(openBtn).toBeTruthy();
    const printBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Print PDF'));
    expect(printBtn).toBeTruthy();
    const downloadBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Download PDF'));
    expect(downloadBtn).toBeTruthy();
  });
  /**
   * Test to check if the report is created.
   */
  it('should create PDF', () => {
    // GIVEN
    const openSpy = jasmine.createSpy('open');
    const document: PDFKit.PDFDocument = {} as PDFKit.PDFDocument;
    spyOn(pdfMake, 'createPdf').and.returnValue({
      open: openSpy,
      print: () => undefined,
      download: () => undefined,
      getBlob: () => undefined,
      getBase64: () => undefined,
      getBuffer: () => undefined,
      getDataUrl: () => undefined,
      getStream: () => document
    });
    fixture.detectChanges();
    const openBtn = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Open PDF')
    );
    expect(openBtn).toBeTruthy();
    // WHEN
    openBtn!.nativeElement.click();
    // THEN
    expect(pdfMake.createPdf).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();

    const docDef = (pdfMake.createPdf as jasmine.Spy).calls.mostRecent().args[0];
    const reportTitleActual = docDef.content[0].text;
    expect(reportTitleActual).toBe('Missions and Rockets Report');

    const tableActual = docDef.content[1].table.body;
    expect(tableActual[0][0].text).toBe('Mission');
    expect(tableActual[0][1].text).toBe('Mission Status');
    expect(tableActual[0][2].text).toBe('Number Of Rockets');
    expect(tableActual[0][3].text).toBe('Rocket');

    // should be sorted by mission name
    const missionExpected = [testData.TEST_MISSIONS[2], testData.TEST_MISSIONS[1], testData.TEST_MISSIONS[0]];
    for (let i = 0; i < testData.TEST_MISSIONS.length; i++) {
      const missionNameActual = tableActual[i + 1][0].text;
      expect(missionNameActual).toBe(missionExpected[i].name);
      const rocketNameActual = tableActual[i + 1][3];
      expect(rocketNameActual).toBe(missionExpected[i].rockets[0].name);
    }
  });
});
