import { MissionStatus } from '../models/mission-status';
import { RocketStatus } from '../models/rocket-status';
/**
 * Standard data set for web local storage.
 */
export const STANDARD_DATASET = {
  'missions': [
    {
      'id': 1,
      'name': 'Transit',
      'missionStatus': MissionStatus.InProgress,
      'rockets': [
        {
          'id': 11,
          'name': 'Red Dragon',
          'rocketStatus': RocketStatus.OnGround
        },
        {
          'id': 12,
          'name': 'Dragon XL',
          'rocketStatus': RocketStatus.InSpace
        },
        {
          'id': 13,
          'name': 'Falcon Heavy',
          'rocketStatus': RocketStatus.InSpace
        },
      ]
    },
    {
      'id': 2,
      'name': 'Vertical Landing',
      'missionStatus': MissionStatus.InProgress,
      'rockets': [
      ]
    },
    {
      'id': 3,
      'name': 'Double Landing',
      'missionStatus': MissionStatus.Ended,
      'rockets': [
      ]
    },
    {
      'id': 4,
      'name': 'Luna1',
      'missionStatus': MissionStatus.Pending,
      'rockets': [
        {
          'id': 41,
          'name': 'Dragon 1',
          'rocketStatus': RocketStatus.OnGround
        },
        {
          'id': 42,
          'name': 'Dragon 2',
          'rocketStatus': RocketStatus.OnGround
        },
      ]
    },
    {
      'id': 5,
      'name': 'Luna2',
      'missionStatus': MissionStatus.Scheduled,
      'rockets': [
      ]
    },
    {
      'id': 6,
      'name': 'Mars',
      'missionStatus': MissionStatus.Scheduled,
      'rockets': [
      ]
    },
  ]
};

const CHARACTERS = [
  '𝗔', '𝗕', '𝗖', '𝗗', '𝗘', '𝗙', '𝗚', '𝗛', '𝗜', '𝗝', '𝗞', '𝗟', '𝗠',
  '𝗡', '𝗢', '𝗣', '𝗤', '𝗥', '𝗦', '𝗧', '𝗨', '𝗩', '𝗪', '𝗫', '𝗬', '𝗭',
  '𝗮', '𝗯', '𝗰', '𝗱', '𝗲', '𝗳', '𝗴', '𝗵', '𝗶', '𝗷', '𝗸', '𝗹', '𝗺',
  '𝗻', '𝗼', '𝗽', '𝗾', '𝗿', '𝘀', '𝘁', '𝘂', '𝘃', '𝘄', '𝘅', '𝘆', '𝘇', 
  '𝔸', '𝔹', 'ℂ', '𝔻', '𝔼', '𝔽', '𝔾', 'ℍ', '𝕀', '𝕁', '𝕂', '𝕃', '𝕄',
  'ℕ', '𝕆', 'ℙ', 'ℚ', 'ℝ', '𝕊', '𝕋', '𝕌', '𝕍', '𝕎', '𝕏', '𝕐', 'ℤ',
  '𝕒', '𝕓', '𝕔', '𝕕', '𝕖', '𝕗', '𝕘', '𝕙', '𝕚', '𝕛', '𝕜', '𝕝', '𝕞',
  '𝕟', '𝕠', '𝕡', '𝕢', '𝕣', '𝕤', '𝕥', '𝕦', '𝕧', '𝕨', '𝕩', '𝕪', '𝕫',
  '𝓐', '𝓑', '𝓒', '𝓓', '𝓔', '𝓕', '𝓖', '𝓗', '𝓘', '𝓙', '𝓚', '𝓛', '𝓜',
  '𝓝', '𝓞', '𝓟', '𝓠', '𝓡', '𝓢', '𝓣', '𝓤', '𝓥', '𝓦', '𝓧', '𝓨', '𝓩',
  '𝓪', '𝓫', '𝓬', '𝓭', '𝓮', '𝓯', '𝓰', '𝓱', '𝓲', '𝓳', '𝓴', '𝓵', '𝓶',
  '𝓷', '𝓸', '𝓹', '𝓺', '𝓻', '𝓼', '𝓽', '𝓾', '𝓿', '𝔀', '𝔁', '𝔂', '𝔃',
  '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲',
  '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',
];
/**
 * Big data set for web local storage.
 */
export const BIG_DATASET = {
   missions: [
    ...CHARACTERS.map((letterM, indexM) => ({
      id: indexM + 1,
      name: createLabel(indexM) + 'Mission ' + letterM,
      missionStatus: getRandomMissionStatus(),
      rockets: [
        ...CHARACTERS.map((letterR, indexR) => ({
          id: 1000000 + 1000 * (indexR + 1) + indexR + 1,
          name: createLabel(indexR) + 'Rocket ' + letterM + '—' + letterR,
          rocketStatus: getRandomRocketStatus(),
        })),
      ],
    })),
   ],
 };

/**
 * Big data set for web local storage.
 */
export const LONG_NAMES_DATASET = {
  'missions': [
    {
      'id': 1,
      'name':
        '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭' +
        '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇\n' +
        '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ' +
        '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫\n' +
        '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩' +
        '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃\n' +
        '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅' +
        '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟',
      'missionStatus': MissionStatus.Scheduled,
      'rockets': [
        {
          'id': 1,
          'name':
            '01 ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ ' +
            '02 ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ ' +
            '03 ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ ' +
            '04 ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ ' +
            '05 ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ ' +
            '06 ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ ' +
            '07 ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ ' +
            '08 ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ ' +
            '09 ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ ' +
            '10 ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ ',
          'rocketStatus': RocketStatus.OnGround,
        }],
      }
  ]
};

/**
 * Empty data set for web local storage.
 */
export const EMPTY_DATASET = { missions: [] };

/**
 * Helper function to get a random MissionStatus.
 */
function getRandomMissionStatus(): MissionStatus {
  const statuses = [
    MissionStatus.Scheduled,
    MissionStatus.Pending,
    MissionStatus.InProgress,
    MissionStatus.Ended,
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
/**
 * Helper function to get a random RocketStatus.
 */
function getRandomRocketStatus(): RocketStatus {
  const statuses = [
    RocketStatus.OnGround,
    RocketStatus.InSpace,
    RocketStatus.InRepair,
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
/**
 * Function to create a label.
 * @param index - The index.
 * @returns A string with the label.
 */
function createLabel(index: number): string {
  const emojis = ['❤️', '💚', '💙', '💜', '💛', '🧡', '🤎', '🤍', '🖤'];
  const index1 = Math.floor(index / emojis.length) % emojis.length;
  const index2 = index % emojis.length;
  return emojis[index1] + emojis[index2];
}
