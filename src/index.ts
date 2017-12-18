import { ErrorHandler } from "@angular/core";
import { Bugsnag } from "bugsnag-js";

function createPlugin(): Bugsnag.IPlugin {
  return {
    init: (client: Bugsnag.Client): typeof ErrorHandler => {
      class BugsnagErrorHandler extends ErrorHandler {
        public handleError(error: any) {
          const handledState = {
            severity: "error",
            severityReason: { type: "unhandledException" },
            unhandled: true,
          };

          const report = new client.BugsnagReport(
            error.name,
            error.message,
            client.BugsnagReport.getStacktrace(error),
            handledState,
          );

          if (error.ngDebugContext) {
            report.updateMetaData("angular", {
              component: error.ngDebugContext.component,
              context: error.ngDebugContext.context,
            });
          }

          client.notify(report);
          ErrorHandler.prototype.handleError.call(this, error);
        }
      }
      return BugsnagErrorHandler;
    },
  };
}

export default createPlugin;
