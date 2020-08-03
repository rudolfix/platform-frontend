package org.neufund.mobile.custom_modules;

import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

/**
 * Protects screens marked as protected from the Javascript side by
 * - hiding screen content when app is in the background state
 * - disallowing taking screenshots / recording
 */
public class RNProtectScreenModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  RNProtectScreenModule(ReactApplicationContext reactContext) {
    super(reactContext);

    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNProtectScreen";
  }

  @ReactMethod
  public void enable() {
    runOnUiThread(() -> {
      this.reactContext.getCurrentActivity().getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
    });
  }

  @ReactMethod
  public void disable() {
    runOnUiThread(() -> {
      this.reactContext.getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
    });
  }
}
