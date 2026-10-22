import { getAlbums, getLab, hasContact } from './content';
import type { NavItem } from './site';

/** Drops menu items whose page has nothing to show yet (no contact details, no album photos). */
export function visibleNav(items: NavItem[]): NavItem[] {
  const contact = hasContact(getLab());
  const album = getAlbums().length > 0;
  return items.filter((i) => !i.requires || (i.requires === 'contact' ? contact : album));
}
