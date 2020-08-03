#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>


/// Shows launch screen for screens that are marked as protected on the JavaScript side
@interface RNProtectScreen : NSObject <RCTBridgeModule>

+ (void)init:(NSString * _Nonnull)storyboardName
viewController:(UIViewController * _Nonnull)viewController;

+ (void)handleBackgroundState;

+ (void)handleForegroundState;

@end
