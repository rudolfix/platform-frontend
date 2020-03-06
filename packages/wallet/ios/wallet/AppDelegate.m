/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
// Firebase services
#import <Firebase.h>
// Package to manage notifications
#import "RNNotifications.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize firebase

  [FIRApp configure];

  [FIRMessaging messaging].delegate = self;
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"wallet"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];



 if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
        UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
        requestAuthorizationWithOptions:authOptions
        completionHandler:^(BOOL granted, NSError * _Nullable error) {
          // ...
        }];
  } else {
    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }

  [application registerForRemoteNotifications];

  // Push notifications
  [RNNotifications startMonitorNotifications];
  
  

  return YES;
}

// Remote push notifications registration
/*
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  //TODO: REMOVE AFTER TESTING!!!!!
  printf("Hell from IOS devic11eToken @s \n", deviceToken);

  NSString *token = [[[[deviceToken description]
                      stringByReplacingOccurrencesOfString:@" " withString:@""]
                      stringByReplacingOccurrencesOfString:@"<" withString:@""]
                      stringByReplacingOccurrencesOfString:@">" withString:@""];
   NSLog(token);

  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
*/
- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  printf("------------APSN TOKEN-----------");
    [FIRMessaging messaging].APNSToken = deviceToken;
  
  
  
  [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
                                                      NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Error fetching remote instance ID: %@", error);
    } else {
      NSLog(@"---------------Remote instance ID token: %@", result.token);
      NSString* message =
        [NSString stringWithFormat:@"Remote InstanceID token: %@", result.token];
  
    }
  }];
  
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
   printf("------------fcmToken TOKEN-----------");
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
 
  
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  printf("----------ERRROR------------");
  NSLog(error);
  //[RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
