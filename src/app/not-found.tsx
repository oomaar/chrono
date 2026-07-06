import Link from "next/link";
import { Button, ScreenState } from "@/features/design-system";
import { MissingMoment } from "@/features/illustrations";

export default function NotFound() {
  return (
    <ScreenState
      tone="brand"
      kicker="No Such Moment · 404"
      title="That moment is not on the timeline."
      description="The route you followed does not resolve to an existing moment. Return to the live console to continue."
      illustration={<MissingMoment className="h-32 w-auto" />}
      action={
        <Button asChild size="md">
          <Link href="/">Return to now</Link>
        </Button>
      }
      footnote="live · reconstructed at the playhead"
    />
  );
}
