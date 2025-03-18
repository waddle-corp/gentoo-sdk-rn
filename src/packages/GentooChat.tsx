import { fetchChatbotData, fetchChatUserId, fetchFloatingData } from "../api/sdkApi";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Dimensions, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";
import config from "../config/env";

type GentooChatProps = {
    partnerId: string;
    authCode: string;
    itemId: string;
    displayLocation: string;
}

export default function GentooChat({ partnerId, authCode, itemId, displayLocation }: GentooChatProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [floatingComment, setFloatingComment] = useState('');
    const [chatUserId, setChatUserId] = useState('');
    const [position, setPosition] = useState({});
    const floatingImageSource = { uri: 'https://d32xcphivq9687.cloudfront.net/public/img/units/floating-gentoo-static.png' };
    const chatCloseImageSource = { uri: 'https://d32xcphivq9687.cloudfront.net/public/img/units/chat-shrink-md.png' };
    const modalHandlerImageSource = { uri: 'https://d32xcphivq9687.cloudfront.net/public/img/units/sdk-bs-handler.png' };
    // const chatUrl = `https://demo.gentooai.com/chatroute/$gentoo?ptid=${partnerId}&ch=${isMobileDevice}&cuid=${chatUserId}&utms=${utm.utms}&utmm=${utm.utmm}&utmca=${utm.utmcp}&utmco=${utm.utmct}&utmt=${utm.utmt}&tp=${utm.tp}`
    const chatUrl = `${config.CHAT_BASE_URL}/chatroute/$gentoo?ptid=${partnerId}&ch=true&cuid=${authCode}`

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    }

    useFocusEffect(
        useCallback(() => {
            fetchChatUserId(authCode)
                .then((chatUserId) => {
                    console.log('chatUserId', chatUserId);
                    setChatUserId(chatUserId);
                })
                .catch((error) => {
                    console.error(error);
                });

            fetchChatbotData(partnerId)
                .then((chatbotData) => {
                    console.log('chatbotData', chatbotData.mobilePosition);
                    setPosition(chatbotData.mobilePosition);
                })
                .catch((error) => {
                    console.error(error);
                });

            fetchFloatingData(partnerId, displayLocation)
                .then((floatingData) => {
                    floatingData.comment.split('').forEach((text: string, index: number) => {
                        setTimeout(() => {
                            setFloatingComment((prevComment) => prevComment + text);
                        }, 1000 / floatingData.comment.length * index);
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
            <View style={[styles.floatingButtonContainer, position]}>
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
                transparent={true}
                onRequestClose={toggleChat}
            >
                <View style={styles.fullScreenContainer}>
                    <View style={styles.modalContainer}>
                        {/* Close button */}
                        <View style={styles.closeButtonContainer}>
                            <Image source={modalHandlerImageSource} style={styles.modalHandlerImage} />
                            <Text style={styles.closeButtonText}>Powered By Gentoo</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={toggleChat}>
                                <Image source={chatCloseImageSource} style={styles.closeButtonImage} />
                            </TouchableOpacity>
                        </View>

                        {/* Chat WebView */}
                        <WebView
                            source={{ uri: chatUrl }}
                            style={styles.webview}
                        />
                    </View>
                </View>
            </Modal>
        </>
    )
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: -100,
        zIndex: 9999,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
    },
    floatingButton: {
        width: 60,
        height: 60,
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
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '90%',
        backgroundColor: 'transparent',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    closeButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 44,
        // padding: 10,
        // marginTop: Platform.OS === 'ios' ? 40 : 10,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 10,
        // padding: 10,
        // marginTop: Platform.OS === 'ios' ? 40 : 10,
        marginRight: 10,
    },
    closeButtonImage: {
        width: 20,
        height: 20
    },
    closeButtonText: {
        alignSelf: 'center',
        color: '#999',
        fontWeight: 'light',
        fontSize: 12
    },
    modalHandlerImage: {
        width: 40,
        height: 4,
        marginBottom: 8,
    },
    webview: {
        flex: 1,
    },
    floatingCommentContainer: {
        maxWidth: 140,
        backgroundColor: '#222',
        zIndex: 9999,
        padding: 10,
        borderRadius: 10,
        marginRight: 8
    },
    floatingCommentText: {
        color: '#fff',
        fontSize: 12,
        wordWrap: 'break-word'
    }
});
