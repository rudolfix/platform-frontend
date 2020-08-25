#import "RNBiometrics.h"
#import <React/RCTConvert.h>
#import <LocalAuthentication/LocalAuthentication.h>
#import <Security/Security.h>


@implementation RNBiometrics


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isSensorAvailable:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *laError = nil;
  BOOL canEvaluatePolicy = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&laError];

  if (canEvaluatePolicy) {
    NSString *biometryType = [self getBiometryType:context];
    NSDictionary *result = @{
      @"available": @(YES),
      @"biometryType": biometryType
    };

    resolve(result);
  } else {
    NSString *errorMessage = [NSString stringWithFormat:@"%@", laError];

    NSDictionary *result = @{
      @"available": @(NO),
      @"error": errorMessage

    };

    resolve(result);
  }
}

- (NSString *)getBiometryType:(LAContext *)context
{
  if (@available(iOS 11, *)) {
    return (context.biometryType == LABiometryTypeFaceID) ? @"IOSFaceID" : @"IOSTouchID";
  }

  return @"IOSTouchID";
}

@end
