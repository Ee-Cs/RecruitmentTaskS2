import { MissionStatus } from 'models/mission-status';
import { RocketStatus } from 'models/rocket-status';
/**
 * Application tools.
 */
export class AppTools {
  /**
   * Display mission status.
   * @param mission status the mission status
   */
  displayMissionStatus(missionStatus: MissionStatus): string {
    switch (missionStatus) {
      case MissionStatus.Scheduled:
        return '🟣 ' + missionStatus;
      case MissionStatus.Pending:
        return '🟡 ' + missionStatus;
      case MissionStatus.InProgress:
        return '🟢 ' + missionStatus;
      // MissionStatus.Ended
      default:
        return '🟤 ' + missionStatus;
    }
  }
  /**
   * Display rocket status.
   * @param rocket status the rocket status
   */
  displayRocketStatus(rocketStatus: RocketStatus): string {
    switch (rocketStatus) {
      case RocketStatus.OnGround:
        return '🟨 ' + rocketStatus;
      case RocketStatus.InSpace:
        return '🟩 ' + rocketStatus;
      // RocketStatus.InRepair
      default:
        return '🟥 ' + rocketStatus;
    }
  }
}