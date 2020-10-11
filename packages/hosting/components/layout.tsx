import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
];

type LayoutProps = PropsWithChildren<{
  title: string;
}>;

export function Layout({ children, title }: LayoutProps) {
  return (
    <section>
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 flex items-center">
          <h1 className="flex-1 m-0 py-4 text-2xl font-bold">
            <MaybeLink href="/" className="text-white">
              AoE<span className="text-accent">2</span> Live
            </MaybeLink>
          </h1>
          <nav>
            <ul className="block m-0 p-0">
              {navItems.map(([label, href]) => (
                <li className="inline-block" key={href}>
                  <MaybeLink
                    href={href}
                    className="inline-block ml-3 px-3 py-1 rounded
                             bg-gray-800 text-white"
                    linkClassName="inline-block ml-3 px-3 py-1 rounded
                                   text-white hover:bg-red-800"
                  >
                    {label}
                  </MaybeLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6">{children}</main>
    </section>
  );
}

type MaybeLinkProps = PropsWithChildren<{
  className?: string;
  linkClassName?: string;
  href: string;
}>;

function MaybeLink({
  children,
  className,
  linkClassName,
  href,
}: MaybeLinkProps) {
  const { pathname } = useRouter();

  if (href === pathname) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link href={href}>
      <a className={linkClassName || className}>{children}</a>
    </Link>
  );
}
