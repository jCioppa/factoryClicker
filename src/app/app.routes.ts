import { MainComponent } from "./main/main.component";

const route = (path: string, component: any) => ({ path, component });

export const routes = [
    route('factoryClicker', MainComponent)
]