/* eslint-disable @typescript-eslint/no-unused-vars */
import { getData, storeData } from "@/common/AsyncStorageService";
import moment from "moment";
import React, {
    useState,
    type FC,
    memo,
    useCallback,
    createContext,
    useContext,
    useEffect,
    type ReactElement,
} from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface AState {
    a: number;
    setA: (value: number) => void;
    b: number;
}

const AContext = createContext<AState>({
    a: 0,
    setA: () => {},
    b: 12,
});

const Home: FC = () => {
    const [outer, setOuter] = useState(true);
    const [a, setA] = useState(2);

    console.log("render 0");

    const onPress = (): void => {
        setOuter(!outer);
        setA(1 - a);
    };

    return (
        <AContext.Provider value={{ a, setA, b: 12 }}>
            <View className="flex-1 justify-center items-center bg-white flex-row">
                <View className="justify-center items-center">
                    <TouchableOpacity className="mb-5 p-3" onPress={onPress}>
                        <Text className="text-base">{a}</Text>
                    </TouchableOpacity>
                    <Component1 outer={outer} />
                </View>
                <View className="justify-center items-center ml-3">
                    <Component4 />
                </View>
                <View className="justify-center items-center ml-3">
                    <Component6 />
                </View>
            </View>
        </AContext.Provider>
    );
};

const Component1 = memo(function Component1({
    outer,
}: {
    outer: boolean;
}): ReactElement {
    const [number1, setNumber1] = useState(0);

    const onPress = useCallback(() => {
        setNumber1(1 - number1);
    }, [number1]);

    console.log("render 1");
    return (
        <View className="p-3 space-y-2 bg-[#A3B18A] items-center">
            <TouchableOpacity onPress={onPress} className="mb-5 p-3">
                <Text className="text-base">{number1}</Text>
            </TouchableOpacity>
            <Component2 />
        </View>
    );
});

const Component2: FC = memo(function Component2() {
    const { a, setA } = useContext(AContext);

    const onPress = useCallback(() => {
        setA(-a);
    }, [a]);

    console.log("render 2");

    return (
        <View className="p-3 bg-[#588157] items-center">
            <TouchableOpacity onPress={onPress} className="mb-5 p-3">
                <Text className="text-white text-base">sun</Text>
            </TouchableOpacity>
            <Component3 />
        </View>
    );
});

const Component3: FC = memo(function Component3() {
    const onPress = useCallback(() => {}, []);
    const { setA } = useContext(AContext);

    console.log("render 3");
    return (
        <View className="p-3 bg-[#3A5A40] items-center">
            <TouchableOpacity onPress={onPress}>
                <Text className="text-white text-base">moon</Text>
            </TouchableOpacity>
        </View>
    );
});

const Component4: FC = memo(function Component4() {
    const [w, setW] = useState<Wrapper>({ b: 6, c: 12 });
    const [d, setD] = useState<number[]>([4, 8]);

    const onPress = useCallback(() => {
        setW({ ...w, b: -w.b });
    }, []);

    console.log("render 4");

    return (
        <View className="p-3 bg-[#A3B18A] items-center">
            <TouchableOpacity onPress={onPress} className="mb-5 p-3">
                <Text className="text-white text-base">
                    {w.b} {w.c} {d[0]} {d[1]}
                </Text>
            </TouchableOpacity>
            <Component5 w={w} setW={setW} d={d} setD={setD} />
        </View>
    );
});

interface Wrapper {
    b: number;
    c: number;
}

interface Component5Props {
    w: Wrapper;
    d: number[];
    setD: (value: number[]) => void;
    setW: (value: Wrapper) => void;
}

const Component5: FC<Component5Props> = memo(function Component5({
    w,
    setW,
}: Component5Props) {
    const onPressB = useCallback(() => {
        setW({ ...w, b: -w.b });
    }, [w]);
    const onPressC = useCallback(() => {
        setW({ ...w, c: -w.c });
    }, [w]);

    console.log("render 5");

    return (
        <View className="p-3 bg-[#588157] items-center flex-row">
            <TouchableOpacity onPress={onPressB} className="p-1">
                <Text className="text-white text-base">sun</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressC} className="p-1">
                <Text className="text-white text-base">dial</Text>
            </TouchableOpacity>
        </View>
    );
});

const Component6: FC = () => {
    const [data, setData] = useState([0, 1, 2, 3, ]);
    const increase = useCallback(() => {
        setData([...data, data.length]);
    }, [data]);
    return (
        <View className="p-3 bg-[#DAD7CD] items-center">
            <TouchableOpacity onPress={increase}>
                <Text>Increase</Text>
            </TouchableOpacity>
            <Component7 data={data} />
        </View>
    );
};

interface Component7Props {
    data: number[];
}

const Component7: FC<Component7Props> = ({ data }) => {
    const [d, setD] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const increase = useCallback(() => {
        setD([...d, d.length]);
    }, [d]);
    return (
        <View className="h-[200] bg-[#A3B18A] p-3">
            <TouchableOpacity className="p-2" onPress={increase}>
                <Text>Increase</Text>
            </TouchableOpacity>

            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Text className="p-3 bg-2 bg-[#588157]">{item}</Text>
                )}
            />
        </View>
    );
};

export default Home;
