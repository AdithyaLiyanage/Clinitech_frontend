import React from 'react';
import Logo  from "../assets/logo_nobg.png";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterProps {
  year?: number;
  brandName?: string;
  brandHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  links?: LinkItem[];
}

const Footer: React.FC<FooterProps> = ({
  year = new Date().getFullYear(),
  brandName = 'CliniTech',
  brandHref = 'http://localhost:5173/',
  logoAlt = 'CliniTech Logo',
  links = [
    { label: 'About', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Medical', href: '#' },
    { label: 'Contact', href: '#' },
  ],
}) => {
  return (
    <footer className="bg-white shadow-sm dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href={brandHref}
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src={Logo} className="h-8" alt={logoAlt} />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              {brandName}
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-700 sm:mb-0 dark:text-gray-400">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:underline me-4 md:me-6"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-6 sm:mx-auto lg:my-8 " />

        <span className="block text-sm text-gray-700 sm:text-center dark:text-gray-400">
          © {year}{' '}
          <a href={brandHref} className="hover:underline">
            {brandName}™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
