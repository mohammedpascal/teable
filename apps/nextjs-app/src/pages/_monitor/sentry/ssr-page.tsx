export default function MonitorSentrySsrRoute() {
  return (
    <div>
      <h1>Unexpected error</h1>
      <p>
        If you see this message, it means that the an error thrown in the `getServerSideProps()`
        function wasn't caught by the global error handler (pages/_error.tsx). This is a bug in the
        application and may affect the ability to display error pages and log errors on Sentry. See
        the monitoring page in /pages/_monitor/sentry/ssr-page.tsx.
      </p>
    </div>
  );
}
