import { useEffect, useState } from "react"
import onSubmit from "./src/api/api"
import HashLoader from "react-spinners/HashLoader"
import parseMarkdown from "./src/parseMarkdown/parseMarkdown"
import allowTextareasToDynamicallyResize from "./src/dynamicInput/dynamicInput"
import {
    View,
    Text,
    TextInput,
    Button,
    SafeAreaView,
    ScrollView,
} from "react-native"

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
        const storedApiKey = localStorage.getItem("apiKey")
        if (storedApiKey) {
            setApiKey(storedApiKey)
        }
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
        } else {
            setChecked(true)
        }
    }

    // saves api key to cookies and local storage
    const handleApiKeySave = (e) => {
        e.preventDefault()
        localStorage.setItem("apiKey", apiKey)
    }

    // update textarea height on input
    useEffect(() => {
        allowTextareasToDynamicallyResize()
    }, [])

    return (
        <SafeAreaView className="container mx-auto py-4 max-w-3xl text-center flex-1 items-center justify-center">
            <ScrollView>
                {/* title */}
                <Text className="text-4xl font-bold mb-4 text-center">
                    Well actually... 🧐
                </Text>

                {/* form container */}
                <View onSubmit={handleSubmit} className="flex flex-col mx-5">
                    {/* handles api key input */}
                    <Text className="mb-2 font-bold">API Key</Text>
                    <TextInput
                        type={checked ? "text" : "password"}
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="border-2 rounded border-blue-400 p-2 mb-1"
                    />

                    {/* container for show api key checkbox and save api key button */}
                    <View className="flex flex-row justify-between mb-6 mt-4">
                        {/* handles show api key on/off */}
                        <View className="text-end">
                            <Text className="mb-3 font-bold mr-5">
                                Show API key:
                            </Text>
                            <TextInput
                                type="checkbox"
                                onClick={showPassword}
                                id="show-password"
                            />
                        </View>

                        <View>
                            <Button
                                onClick={handleApiKeySave}
                                className="bg-blue-500 text-white py-1 px-2 rounded text-center w-50 text-md flex justify-center hover:bg-blue-800"
                                title="Save API Key"
                            >
                                Save API Key
                            </Button>
                        </View>
                    </View>

                    {/* handles text prompt from user */}
                    <Text className="mb-2 font-bold">Input Text</Text>
                    <TextInput
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="border-2 rounded-xl border-blue-500 p-3 mb-10 h-auto max-h-none resize-none"
                        numberOfLines={1}
                    ></TextInput>

                    {/* handles button submit */}
                    <View className="flex justify-center">
                        <Button
                            type="submit"
                            className="bg-blue-500 text-white py-3 px-4 rounded text-center w-60 flex justify-center hover:bg-blue-800"
                            disabled={loading}
                            title="Loading..."
                        >
                            {/* when loading spinner is displayed, otherwise button is enabled */}
                            {loading ? (
                                <HashLoader
                                    color="white"
                                    loading={loading}
                                    size={25}
                                    aria-label="Loading"
                                    cssOverride={override}
                                />
                            ) : (
                                <Text className="font-bold">Ask nicely</Text>
                            )}
                        </Button>
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
                                {parsedResult}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default App
