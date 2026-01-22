import { A } from '@solidjs/router';

export default function NotFound() {
  return (
    <div class="flex-col gap-6" style="text-align: center; padding: 4rem 1rem;">
      <h1 class="heading-hero" style="font-size: 6rem;">404</h1>
      <p class="subtitle">Page not found</p>
      <div>
        <A href="/" class="btn btn-md btn-primary">Go Home</A>
      </div>
    </div>
  );
}
