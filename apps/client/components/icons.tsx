type IconProps = {
  className?: string;
};

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg aria-hidden='true' className={className} fill='none' height='18' viewBox='0 0 24 18' width='24'>
      <path d='M1 9h20M14 2l7 7-7 7' stroke='currentColor' strokeLinecap='square' strokeWidth='1.5' />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg aria-hidden='true' className={className} fill='none' height='22' viewBox='0 0 24 24' width='22'>
      <circle cx='10.7' cy='10.7' r='6.7' stroke='currentColor' strokeWidth='1.5' />
      <path d='m16 16 4.5 4.5' stroke='currentColor' strokeLinecap='square' strokeWidth='1.5' />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg aria-hidden='true' className={className} fill='none' height='14' viewBox='0 0 16 16' width='14'>
      <path d='M6 3H2.5v10.5H13V10M8 2h6v6M14 2 7 9' stroke='currentColor' strokeWidth='1.25' />
    </svg>
  );
}
