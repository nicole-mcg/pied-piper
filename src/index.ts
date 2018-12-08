let port: any = process.argv[2];
if (!port) {
    port = "8000";
}
port = (parseInt as any)(port);

import App from "@app/App";
new App(port);
