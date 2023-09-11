import { useEffect, useState } from "react"
import onSubmit from "./src/api/api"
import HashLoader from "react-spinners/HashLoader"
import parseMarkdown from "./src/parseMarkdown/parseMarkdown"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, Text, TextInput, Pressable } from "react-native"
import { Checkbox } from "expo-checkbox"
import "react-native-url-polyfill/auto"

function App() {
    const [apiKey, setApiKey] = useState("")
    const [inputText, setInputText] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const [parsedResult, setParsedResult] = useState("")

    // each time a result is recieved from the API,
    // parses it from plain text to elements
    useEffect(() => {
        setParsedResult(parseMarkdown(result))
    }, [result])

    // gets api key from cookies and local storage and sets it into api key input field
    useEffect(() => {
        const fetchApiKey = async () => {
            return await getData("apiKey")
        }
        const fetchPasswordHiddenChecked = async () => {
            return await getData("passwordHiddenChecked")
        }
        fetchApiKey().then((value) => {
            if (value) {
                setApiKey(value)
            }
        })

        fetchPasswordHiddenChecked().then((value) => {
            if (typeof maybeObject != "undefined") {
                setChecked({ value })
            }
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        onSubmit(apiKey, inputText, setResult).then(() => {
            setLoading(false)
        })
    }

    // overrides default css for HashLoader spinner
    const override = {
        display: "block",
        margin: "0 auto",
    }

    const showPassword = () => {
        if (checked) {
            setChecked(false)
            storeData("passwordHiddenChecked", false)
        } else {
            setChecked(true)
            storeData("passwordHiddenChecked", true)
        }
    }

    // saves api key to cookies and local storage
    const handleApiKeySave = async () => {
        e.preventDefault()
        storeData("apiKey", apiKey)
    }

    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
            console.log("Stored data to Async storage: " + key + " " + value)
        } catch (e) {
            console.log(
                "Error storing data to Async storage: " + key + " " + value
            )
            console.log(e)
        }
    }

    const getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            console.log("Retrieved from Async storage: " + key + " " + value)
            return value
        } catch (e) {
            console.log("Error retrieving from Async storage: " + key)
            console.log(e)
        }
    }

    return (
        <View className="container mx-auto py-10 max-w-3xl">
            {/* title */}
            <Text className="text-4xl font-bold mb-4 text-center">
                Well actually... 🧐
            </Text>

            {/* form container */}
            <View onSubmit={handleSubmit} className="flex flex-col mx-5">
                {/* handles api key input */}
                <Text className="mb-2 font-bold">API Key</Text>
                <TextInput
                    value={apiKey}
                    onChangeText={setApiKey}
                    className="border-2 rounded border-blue-400 p-2 mb-1"
                    placeholder="Enter API key"
                    secureTextEntry={!checked}
                />

                {/* container for show api key checkbox and save api key button */}
                <View className="flex flex-row justify-between mb-6 mt-4">
                    {/* handles show api key on/off */}
                    <View className="text-end">
                        <Text className="mb-3 font-bold mr-5">
                            Show API key:
                        </Text>
                        <Checkbox
                            onValueChange={showPassword}
                            value={checked}
                        />
                    </View>

                    <View>
                        <Pressable
                            onPress={handleApiKeySave}
                            className="bg-blue-500 text-white py-1 px-2 rounded text-center w-50 text-md flex justify-center hover:bg-blue-800"
                            title="Save API Key"
                        >
                            <Text>Save API Key</Text>
                        </Pressable>
                    </View>
                </View>

                {/* handles text prompt from user */}
                <Text className="mb-2 font-bold">Input Text</Text>
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    className="border-2 rounded-xl border-blue-500 p-3 mb-10 h-auto max-h-none resize-none"
                />

                {/* handles Pressable submit */}
                <View className="flex justify-center">
                    <Pressable
                        className="bg-blue-500 text-white py-3 px-4 rounded text-center w-60 flex justify-center hover:bg-blue-800"
                        disabled={loading}
                        title="Loading..."
                        onPress={handleSubmit}
                    >
                        {/* when loading spinner is displayed, otherwise Pressable is enabled */}
                        {loading ? (
                            // <HashLoader
                            //     color="white"
                            //     loading={loading}
                            //     size={25}
                            //     aria-label="Loading"
                            //     cssOverride={override}
                            // />
                            <Text className="font-bold">
                                Thinking deeply 🧐
                            </Text>
                        ) : (
                            <Text className="font-bold">Ask nicely</Text>
                        )}
                    </Pressable>
                </View>
            </View>

            {/* result display */}
            <View>
                {result && (
                    <Text className="font-bold mb-2 mx-4 mt-6">Result</Text>
                )}
                {result && (
                    <View className="border-2 rounded-xl border-blue-400 p-4 mt-2 mx-4">
                        <View className="whitespace-pre-line">
                            <Text>{parsedResult}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}

export default App
