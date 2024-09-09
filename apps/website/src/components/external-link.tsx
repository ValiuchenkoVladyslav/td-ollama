export function ExternalLink(
  props: Omit<React.LinkHTMLAttributes<HTMLAnchorElement>, "target" | "rel">,
) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
