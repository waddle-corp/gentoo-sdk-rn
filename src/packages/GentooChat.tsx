

import { fetchFloatingData } from "../api/sdkApi";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Dimensions, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

type GentooChatProps = {
    partnerId: string;
    authCode: string;
    itemId: string;
    displayLocation: string;
}

export default function GentooChat({ partnerId, authCode, itemId, displayLocation }: GentooChatProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [floatingComment, setFloatingComment] = useState('');
    const floatingImageSource = { uri: 'https://d32xcphivq9687.cloudfront.net/public/img/units/floating-gentoo-static.png'};

    // const chatUrl = `https://demo.gentooai.com/chatroute/${partnerType}?ptid=${partnerId}&ch=${isMobileDevice}&cuid=${chatUserId}&utms=${utm.utms}&utmm=${utm.utmm}&utmca=${utm.utmcp}&utmco=${utm.utmct}&utmt=${utm.utmt}&tp=${utm.tp}`
    const chatUrl = `https://demo.gentooai.com/chatroute/$gentoo?ptid=${partnerId}&ch=true&cuid=${authCode}`

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    }

    useFocusEffect(
        useCallback(() => {
            fetchFloatingData(partnerId, displayLocation)
                .then((res) => {
                    res.comment.split('').forEach((text: string, index: number) => {
                        setTimeout(() => {
                            setFloatingComment((prevComment) => prevComment + text);
                        }, 1000 / res.comment.length * index);
                    });
                })
                .catch((error) => {
                    console.error(error);
                });

            setTimeout(() => {
                setFloatingComment('');
            }, 2000);
        }, [])
    );

    return (
        <>
            {/* Floating button */}
            <View style={styles.floatingButtonContainer}>
                {
                    floatingComment && (
                        <View style={styles.floatingCommentContainer}>
                            <Text style={styles.floatingCommentText}>{floatingComment}</Text>
                        </View>
                    )
                }
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={toggleChat}
                >
                    <Image source={floatingImageSource} style={styles.buttonImage} />
                </TouchableOpacity>
            </View>

            {/* Chat Modal */}
            <Modal
                visible={isChatOpen}
                animationType="slide"
                transparent={false}
                onRequestClose={toggleChat}
            >
                <View style={styles.modalContainer}>
                    {/* Close button */}
                    <TouchableOpacity style={styles.closeButton} onPress={toggleChat}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    {/* Chat WebView */}
                    <WebView
                        source={{ uri: chatUrl }}
                        style={styles.webview}
                    // Some optional props, if needed:
                    // onMessage={(event) => { console.log("Message from chat:", event.nativeEvent.data); }}
                    // injectedJavaScript={...}
                    // sharedCookiesEnabled={true}
                    // javaScriptEnabled={true}
                    />
                </View>
            </Modal>
        </>
    )
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 9999,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        // backgroundColor: '#154cca', // iOS default blue
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },
    buttonImage: {
        width: 60,
        height: 60
    },
    buttonText: {
        color: '#fff',
        fontSize: 10
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        marginTop: Platform.OS === 'ios' ? 40 : 10,
        marginRight: 10,
        backgroundColor: '#666',
        borderRadius: 4
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    webview: {
        flex: 1,
        marginTop: 10
    },
    floatingCommentContainer: {
        maxWidth: 120,
        backgroundColor: '#222',
        zIndex: 9999,
        padding: 10,
        borderRadius: 10,
        marginRight: 10
    },
    floatingCommentText: {
        color: '#fff',
        fontSize: 12
    }
});
