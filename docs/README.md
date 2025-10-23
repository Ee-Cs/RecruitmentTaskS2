# The Recruitment Task S2
An Angular 20 + Angular Material application using an in-memory store.  

<table>
  <tr>
    <td rowspan="3"><img alt="" src="images/borderLeft.png"></td>
    <td><img alt="" src="images/borderHorizontal.png"></td>
    <td rowspan="3"><img alt="" src="images/borderRight.png"></td>
  </tr>
  <tr>
    <td>
      Live demo&nbsp;&nbsp;➔&nbsp;&nbsp;
      <a href="https://ee-cs.github.io/RecruitmentTaskS2/">Recruitment Task S2 (GitHub Pages)</a>
    </td>
  </tr>
  <tr>
    <td><img alt="" src="images/borderHorizontal.png"></td>
  </tr>
</table>

## ❶ Architecture
```mermaid
---
title: Business Logic
---
flowchart LR
  HOME(Home):::orangeBox
  MNG_MIS(Manage Missions):::redBox
  TRA_ROC(Transfer Rockets):::greenBox
  PDF(Create PDF Reports):::yellowBox
%% Flows
  subgraph Node.js
    subgraph "Angular Application"
      HOME --> MNG_MIS
      HOME --> TRA_ROC
      HOME --> PDF
    end
  end
%% Style Definitions
  classDef redBox fill: #ff6666, stroke: #000, stroke-width: 2px
  classDef greenBox fill: #00ff00, stroke: #000, stroke-width: 2px
  classDef yellowBox fill: #ffff00, stroke: #000, stroke-width: 2px
  classDef orangeBox  fill: #ffa500,stroke: #000, stroke-width:2px
```

---

```mermaid
---
title: Model Class Diagram
---
classDiagram
class Mission {
  +number id
  +string name
  +MissionStatus missionStatus
  +Rocket[] rockets
}

class Rocket {
  +number id
  +number missionId
  +string name
  +RocketStatus rocketStatus
}

class MissionStatus {
  <<enumeration>>
  🟣 +Scheduled = "Scheduled"
  🟡 +Pending = "Pending"
  🟢 +InProgress = "In Progress"
  🟤 +Ended = "Ended"
}

class RocketStatus {
  <<enumeration>>
  🟨 +OnGround = "On Ground"
  🟩 +InSpace = "In Space"
  🟥 +InRepair = "In Repair"
}

Mission "1" o-- "*" Rocket : rockets
MissionStatus <|.. Mission : missionStatus
RocketStatus <|.. Rocket : rocketStatus
```

---


```mermaid
---
title: Mission State Diagram
---
stateDiagram
direction TB

%% State definitions
state "Scheduled" as SCH
state CHO <<choice>>
state "In Progress" as PRG
note right of PRG
  Space mission in progress.
end note
state "Pending" as PND
state "Ended" as END

%% Transitions
[*] --> SCH:::schedClass
SCH --> CHO
CHO --> PRG:::progClass : rockets assigned
CHO --> END:::endClass : mission cancelled
PRG --> PND:::pendClass : rocket in repair
PND --> PRG : rocket fixed
PRG --> END : rockets unassigned
END --> [*]

%% Style definitions
classDef schedClass fill: plum, stroke: #000, stroke-width: 2px
classDef progClass fill: lime, stroke: #000, stroke-width: 2px,font-weight:bold
classDef pendClass fill: yellow, stroke: #000, stroke-width: 2px, font-style:italic,stroke-width:2px,stroke:red
classDef endClass fill: peru, stroke: #000, stroke-width: 2px
```

---

```mermaid
---
title: Rocket Flowchart
---
flowchart LR

%% Node definitions
GND(On Ground):::yellowBox
SPC(In Space):::greenBox
REP((In Repair)):::redBox

%% Flows
subgraph "Space mission in progress"
  GND <--> SPC
end
GND <.-> REP
SPC <.-> REP

%% Style definitions
classDef redBox fill: #ff6666, stroke: #000, stroke-width: 2px
classDef greenBox fill: #00ff00, stroke: #000, stroke-width: 2px
classDef yellowBox fill: #ffff00, stroke: #000, stroke-width: 2px
```

---

<details>
<summary><mark>Mission object JSON</mark></summary>

```json
{
  "missions": [
    {
      "id": 1,
      "name": "Moon",
      "missionStatus": "InProgress",
      "rockets": [
        {
          "id": 1,
          "name": "Apollo",
          "rocketStatus": "OnGround"
        }
      ]
    }
  ]
}
```

</details>

## ❷ Description of the Business Logic
1. **When the "Home" page is selected:**
  - The chosen dataset is loaded.
  - Four datasets are available:
    - **Standard**
      - Dataset described in the business requirements.
      - Used in Cypress tests.
    - **Large Scale**
      - 182 missions.
      - Each mission contains 182 rockets.
      - Total number of rockets: 33,124.
    	- The generated report spans approximately 850 pages.
    - **Long Names**
    	- A single mission with a long name.
      - A single rocket with a long name is assigned to this mission.
      - Names may be up to 300 characters.
    - **Empty**
      - No missions and no rockets.
      - Used in Cypress tests.
  - The selected dataset is saved to local storage.
  - The previously saved dataset is overwritten.

2. **When the "Manage Missions" page is selected:**
  - Perform create, read, update, and delete operations for missions.
  - For each mission, perform create, read, update, and delete operations for rockets.
  - Implemented features:
    - Changing mission and rocket statuses.
    - Pagination with options for 5, 10, 20, 50, 100, or 200 records per page.
    - Default pagination: 5 records per page.
    - Sorting by name or status.
3. **When the "Transfer Rockets" page is selected:**
  - The right pane shows unassigned rockets (the rocket pool).
  - The left pane shows rockets of the selected mission that are not in space.
  - Create an unassigned rocket with the status "On Ground".
  - Add that unassigned rocket to the rocket pool.
  - Assign rockets from the rocket pool to the selected mission.
  - Unassign rockets from the selected mission and transfer them to the rocket pool.
4. **When the "Create PDF Reports" page is selected:**
  - The application generates a PDF report.
  - The generated file can be opened, downloaded, or printed.
  - The "Missions and Rockets Report" provides a summary of missions.
  - Missions in the report are sorted by the number of rockets assigned.
  - Each mission entry shows the mission status and all rockets assigned to that mission.

---

## ❸ Testing
 - 80 unit tests for components and services.
 - 6 end-to-end (integration) tests using Cypress.
 - 32 [screenshots](https://github.com/ee-cs/RecruitmentTaskS2/tree/main/cypress/screenshots) generated by Cypress.
- [Live demo](https://ee-cs.github.io/RecruitmentTaskS2/) with multiple datasets.

---

## ❹ Development
<details>
<summary>Proposed Validation Logic to Implement</summary>

- Before setting a rocket status to "In Space", ensure that the mission is not "Scheduled".
- Before setting a rocket status to "In Repair", ensure that the mission is "Pending".
- Before changing a mission status from "Pending" to another status, ensure no rocket in the mission has the status "In Repair".
- Before changing a mission status to "In Progress", ensure no rocket in the mission has the status "In Repair".
- Before changing a mission status to "Ended", ensure no rocket in the mission has the status "In Space".
- Rockets must not be assigned to missions with the status "Ended"; rockets may only be unassigned from such missions.

</details>

<details>
<summary>Managing Unassigned Rockets in the Rocket Pool</summary>

| Action | Expected | Actual  |
|--------|----------|---------|
| Create | ✅ Yes   | ✅ Yes |
| Update | ✅ Yes   | ❌ No  |
| Read   | ✅ Yes   | ✅ Yes |
| Delete | ✅ Yes   | ❌ No  |
</details>


<details>
<summary>Proposed Enhancements</summary>

Replace the in-memory store with an appropriate database.\
Refactor application logging. \
Add authorization and authentication. \
Add event auditing and error monitoring to maintain high-quality service. \
Add a business process model and a decision model for missions and rockets workflow. \
Add a blockchain for missions and rockets management. \
Switch to nanoservices on a cloud platform.
</details>

<details>
<summary>Mission Model Refinement</summary>

- [x] id
- [x] name
- [ ] description
- [x] assigned rockets
- [ ] creation date
- [ ] created by user
- [ ] updating date
- [ ] updated by user
- [ ] assign date
- [ ] assigned by user
- [ ] unassign date
- [ ] unassigned by user
- [ ] delete date
- [ ] deleted by user
</details>
