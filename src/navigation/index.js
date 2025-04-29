import { useRootContext } from "../context/RootContext";
import SplashScreen from "../screens/SplashScreen";
import StackNavigator from "./StackNavigator";
import TabNavigator from "./TabNavigator";

export default function RootNavigator(){
    
    const {loading} = useRootContext();

    return (
        loading ? <SplashScreen /> : <StackNavigator/>
    );
}