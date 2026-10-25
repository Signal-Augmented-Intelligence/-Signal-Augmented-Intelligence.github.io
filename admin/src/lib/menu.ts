/**
 * 관리 화면 메뉴. 공개 사이트와 같은 이름을 쓰고, 메뉴 하나에 화면 하나입니다.
 * 따로 화면을 두지 않는 것: 로그인(어느 화면이든 로그인 전이면 그 자리에 로그인 칸), 비밀번호 바꾸기(헤더의 팝업),
 * 세미나 승인(Seminars 화면 위쪽의 승인 대기 목록), 변경 기록(항목마다 "이전 기록" 팝업).
 * `ready`: 그 화면이 만들어졌는지. 만들기 전에는 메뉴에 글자만 보이고 누를 수 없습니다.
 */
export type Role = 'member' | 'site_manager';
export type MenuItem = { title: string; href: string; roles: Role[]; ready: boolean; note: string };

export const MENU: MenuItem[] = [
  { title: '첫 화면', href: '/', roles: ['member', 'site_manager'], ready: false, note: '마지막 반영·백업, 승인 대기 세미나' },
  { title: 'Home', href: '/home/', roles: ['site_manager'], ready: false, note: '첫 화면 사진, 시, 랩 정보' },
  { title: 'Members', href: '/members/', roles: ['site_manager'], ready: false, note: '교수님, 멤버' },
  { title: 'Research', href: '/research/', roles: ['site_manager'], ready: false, note: '연구 분야, 논문' },
  { title: 'Seminars', href: '/seminars/', roles: ['member', 'site_manager'], ready: false, note: '세미나 올리기·승인, 세미나 분야' },
  { title: 'Album', href: '/album/', roles: ['site_manager'], ready: false, note: '행사, 사진, 대표 사진' },
  { title: 'News', href: '/news/', roles: ['site_manager'], ready: false, note: '소식' },
  { title: '계정', href: '/accounts/', roles: ['site_manager'], ready: false, note: '멤버·사이트 관리자 계정' },
];
