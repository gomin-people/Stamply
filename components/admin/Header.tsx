'use client';

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="relative flex h-14 w-full items-center px-4">
      <h1 className="text-xl font-semibold text-gomin-black">{title}</h1>
    </header>
  );
};

export default Header;
