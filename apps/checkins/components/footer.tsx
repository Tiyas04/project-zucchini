import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto pb-5">
      <Link
        href="https://gdsc-nitr.netlify.app"
        target="_blank"
        className="text-center text-muted-foreground text-sm  tracking-wide font-semibold"
      >
        Made with ❤️ by DSC NITR
      </Link>
    </footer>
  );
}
