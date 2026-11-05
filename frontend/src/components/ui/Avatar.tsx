const people = [
  { initials: 'AB', name: 'Ava Brown' },
  { initials: 'CD', name: 'Cleo Diaz' },
  { initials: 'EF', name: 'Eli Fournier' },
]

/* Overlapping initials circles; the tooltip carries the full name. */
export function AvatarGroup() {
  return (
    <div role="group" aria-label="Avatar group" className="grid grid-flow-col auto-cols-max">
      {people.map((person) => (
        <span
          key={person.initials}
          title={person.name}
          className="-ml-8 grid size-24 place-items-center rounded-full border border-border bg-subtle text-micro font-medium text-fg first:ml-0"
        >
          {person.initials}
        </span>
      ))}
    </div>
  )
}
