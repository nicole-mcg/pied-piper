declare global {
    interface Route {}
    type RouteHandler = (req:any, res:any, app:App) => any;
    interface App {
        createRoute(path:string, handlerFunc:(req:any, res:any, app:App) => any):void,
        createRoutes(routes:Array<Route>):void,
    }
}

export default {}