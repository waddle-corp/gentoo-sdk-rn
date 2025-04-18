import { fetchChatbotData, fetchChatUserId, fetchFloatingData, logEvent } from "../api/sdkApi";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Keyboard, Linking, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import WebView from "react-native-webview";
import config from "../config/env";
import GentooService from "./GentooService";

type GentooChatProps = {
    showGentooButton: boolean;
}

export default function GentooChat({ showGentooButton }: GentooChatProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [floatingComment, setFloatingComment] = useState('');
    const [chatUserId, setChatUserId] = useState('');
    const [position, setPosition] = useState({});
    const [serviceConfig, setServiceConfig] = useState(GentooService.App.getServiceConfig());
    const [modalHeightPercent, setModalHeightPercent] = useState(0.9);
    const floatingImageSource = { uri: 'https://sdk.gentooai.com/public/img/units/floating-gentoo-static.png' };
    const chatCloseImageSource = { uri: 'https://sdk.gentooai.com/public/img/units/chat-shrink-md.png' };
    const modalHandlerImageSource = { uri: 'https://sdk.gentooai.com/public/img/units/sdk-bs-handler.png' };
    // const chatUrl = `https://demo.gentooai.com/chatroute/$gentoo?ptid=${partnerId}&ch=${isMobileDevice}&cuid=${chatUserId}&utms=${utm.utms}&utmm=${utm.utmm}&utmca=${utm.utmcp}&utmco=${utm.utmct}&utmt=${utm.utmt}&tp=${utm.tp}`
    const chatUrl = `${config.CHAT_BASE_URL}/chatroute/gentoo?ptid=${serviceConfig.partnerId}&ch=true&cuid=${serviceConfig.authCode}`
    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const MODAL_HEIGHT = SCREEN_HEIGHT * modalHeightPercent;

    useEffect(() => {
        // Listen for controller events
        const handleConfigUpdate = (newConfig: any) => setServiceConfig(newConfig);
        const handleToggleChat = () => toggleChat();
        const handleUnmount = () => {
          Animated.timing(pan, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            setIsChatOpen(false);
            pan.setValue(0);
          });
        };
        const handleSendLog = (payload: any) => {
          logEvent(payload);
        };
        
        GentooService.App.on("configChanged", handleConfigUpdate);   
        GentooService.App.on("toggleChat", handleToggleChat);
        GentooService.App.on("unmount", handleUnmount);
        GentooService.App.on("sendLog", handleSendLog);
    
        return () => {
          GentooService.App.off("configChanged", handleConfigUpdate);
          GentooService.App.off("toggleChat", handleToggleChat);
          GentooService.App.off("unmount", handleUnmount);
          GentooService.App.off("sendLog", handleSendLog);
        };
      }, []);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        logEvent({
            eventCategory: "SDKFloatingClicked",
            chatUserId: chatUserId,
            partnerId: serviceConfig.partnerId,
            channelId: 'mobile',
            products: [],
        });
    }

    useFocusEffect(
        useCallback(() => {
            console.log('serviceConfig', serviceConfig);
            if (!serviceConfig.authCode) return;
            fetchChatUserId(serviceConfig.authCode)
                .then((chatUserId) => {
                    console.log('chatUserId', chatUserId);
                    setChatUserId(chatUserId);
                })
                .catch((error) => {
                    console.error(error);
                });

            if (!serviceConfig.partnerId) return;
            fetchChatbotData(serviceConfig.partnerId)
                .then((chatbotData) => {
                    setPosition(chatbotData.mobilePosition);
                })
                .catch((error) => {
                    console.error(error);
                });

            fetchFloatingData(serviceConfig.partnerId, serviceConfig.displayLocation || 'HOME')
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

            logEvent({
                eventCategory: "SDKFloatingRendered",
                partnerId: serviceConfig.partnerId,
                chatUserId: chatUserId,
                channelId: 'mobile',
                products: [],
            });

            setTimeout(() => {
                setFloatingComment('');
            }, 2000);
        }, [serviceConfig])
    );

    const pan = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dy: pan }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (evt, gesture) => {
                console.log('gesture', gesture);
                if (gesture.dy > 100) {
                    Animated.timing(pan, { toValue: MODAL_HEIGHT, duration: 100, useNativeDriver: false }).start(() => {
                        pan.setValue(0);
                        setIsChatOpen(false);
                    });
                } else {
                    Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
                }
            },
        })
    ).current;

    return (
        <>
            {/* Floating button */}
            {
                showGentooButton && 
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
            }

            {/* Chat Modal */}
            <Modal
                visible={isChatOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleChat}
            >
                    <View style={styles.fullScreenContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                Keyboard.dismiss();
                                toggleChat();
                            }}
                            accessible={false}
                        >
                            <View style={styles.backgroundOverlay} />
                        </TouchableWithoutFeedback>
                        <Animated.View
                            style={[styles.modalContainer, { transform: [{ translateY: pan }] }]}
                        >
                            {/* Close button */}
                            <View style={styles.closeButtonContainer}>
                                <View
                                    style={styles.closeButtonContainer}
                                    {...panResponder.panHandlers}
                                >
                                    <Image source={modalHandlerImageSource} style={styles.modalHandlerImage} />
                                    <Text style={styles.closeButtonText}>Powered By Gentoo</Text>
                                </View>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setIsChatOpen(false)}>
                                    <Image source={chatCloseImageSource} style={styles.closeButtonImage} />
                                </TouchableOpacity>
                            </View>

                            {/* Chat WebView */}
                            <WebView
                                source={{ uri: chatUrl }}
                                style={styles.webview}
                                onMessage={(event) => {
                                    const message = JSON.parse(event.nativeEvent.data);
                                    if (message.type === 'redirect') {
                                      Linking.openURL(message.url); // 딥링크로 앱 내 이동
                                    }
                                }}
                            />
                        </Animated.View>
                    </View>

            </Modal>
        </>
    )
}

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
    backgroundOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        width: '100%',
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
