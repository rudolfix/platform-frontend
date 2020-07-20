#import "RNProtectScreen.h"

@implementation RNProtectScreen

static bool _isProtectedScreenVisible = false;
static bool _shouldProtectScreen = false;

static UIViewController *_rootViewController = nil;
static UIViewController *_splashViewController = nil;


RCT_EXPORT_MODULE();

+ (void)init:(NSString * _Nonnull)storyboardName
                  viewController:(UIViewController * _Nonnull)viewController {
  _rootViewController = viewController;

  UIStoryboard *storyboard = [UIStoryboard storyboardWithName:storyboardName bundle:nil];
  
  _splashViewController = [storyboard instantiateInitialViewController];
  [_splashViewController setModalPresentationStyle:UIModalPresentationOverFullScreen];
}

+ (void)handleBackgroundState
{
  if (_shouldProtectScreen && _splashViewController != nil && _rootViewController != nil) {
    _isProtectedScreenVisible = true;

    [_rootViewController presentViewController:_splashViewController animated:false completion:nil];
  }
}

+ (void)handleForegroundState {
  if (_isProtectedScreenVisible) {
    _isProtectedScreenVisible = false;

    [_splashViewController dismissViewControllerAnimated:false completion:nil];
  }
}

RCT_EXPORT_METHOD(enable) {
  _shouldProtectScreen = true;
}

RCT_EXPORT_METHOD(disable) {
  _shouldProtectScreen = true;
}


@end
