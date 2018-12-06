declare global {
    interface Route {}
    interface App {
        createRoute(path:string, handlerFunc:(req:any, res:any, app:App) => any):void,
        createRoutes(routes:Array<Route>):void,
    }
}

export default {}