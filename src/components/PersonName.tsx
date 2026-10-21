import Link from 'next/link';
import { type Person, personHref } from '@/lib/content';

/** A name that links to the member's place on Members when it matches content/people.yml. */
export function PersonName({ name, people }: { name: string; people: Person[] }) {
  const person = people.find((p) => p.name === name || p.id === name);
  if (!person) return <>{name}</>;
  return <Link href={personHref(person)} className="person-link">{person.name}</Link>;
}
