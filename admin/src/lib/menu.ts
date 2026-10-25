/**
 * 관리 화면 메뉴. 공개 사이트와 같은 이름을 쓰고, 메뉴 하나에 화면 하나입니다.
 * 랩 공용 계정 하나로 쓰므로 권한별 메뉴 구분은 없습니다.
 * 따로 화면을 두지 않는 것: 로그인(로그인 전이면 그 자리에 로그인 칸), 비밀번호 바꾸기(헤더의 팝업),
 * 변경 기록(항목마다 "이전 기록" 팝업).
 * `ready`: 그 화면이 만들어졌는지. 만들기 전에는 메뉴에 글자만 보이고 누를 수 없습니다.
 * `group`: 메뉴를 나누는 묶음. 묶음 사이에 가는 선을 둡니다.
 */
export type MenuItem = { title: string; href: string; ready: boolean; note: string; group: 'start' | 'content' };

export const MENU: MenuItem[] = [
  { title: '첫 화면', href: '/', ready: true, note: '마지막 반영·백업', group: 'start' },
  { title: 'Home', href: '/home/', ready: false, note: '첫 화면 사진, 시, 랩 정보', group: 'content' },
  { title: 'Members', href: '/members/', ready: false, note: '교수님, 멤버', group: 'content' },
  { title: 'Research', href: '/research/', ready: false, note: '연구 분야, 논문', group: 'content' },
  { title: 'Seminars', href: '/seminars/', ready: true, note: '세미나 올리기, 세미나 분야', group: 'content' },
  { title: 'Album', href: '/album/', ready: false, note: '행사, 사진, 대표 사진', group: 'content' },
  { title: 'News', href: '/news/', ready: false, note: '소식', group: 'content' },
];
