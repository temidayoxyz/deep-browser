/**
 * Host half. The tab type, intercept, and pane body live in the browser export.
 * This apply exists so the package is a Loader entry the client-modules scan can see.
 */

/** Host plugin body: no host-side service. */
export function apply(): void {}
