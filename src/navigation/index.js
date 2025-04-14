import { AppProvider } from "../context";
import StackNavigator from "./StackNavigator";

export default function RootNavigator(){
    return (
        <AppProvider>
            <StackNavigator/>
        </AppProvider>
    );
}