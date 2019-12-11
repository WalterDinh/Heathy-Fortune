package com.expert;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.zmxv.RNSound.RNSoundPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.sha256lib.Sha256Package;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.horcrux.svg.SvgPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.reactnative.camera.RNCameraPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import java.util.Arrays;
import java.util.List;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import io.wazo.callkeep.RNCallKeepPackage;
import iyegoroff.RNColorMatrixImageFilters.ColorMatrixImageFiltersPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                    new RNSoundPackage(), new RNIapPackage(), new Sha256Package(), new WebRTCModulePackage(),
                    new RNFSPackage(), new RNFirebasePackage(), new InCallManagerPackage(), new RNCallKeepPackage(),
                    new ImageResizerPackage(), new VectorIconsPackage(), new RNCameraPackage(),
                    new RNFetchBlobPackage(), new ImagePickerPackage(), new RNAccountKitPackage(), new RNI18nPackage(),
                    new LinearGradientPackage(), new MapsPackage(), new SvgPackage(), new FastImageViewPackage(),
                    new RNGestureHandlerPackage(), new SplashScreenReactPackage(), new ReactNativeContacts(),
                    new ReactNativeDocumentPicker(), new AndroidKeyboardAdjustPackage(), new AsyncStoragePackage(),
                    new RNFirebaseNotificationsPackage(), new RNFirebaseMessagingPackage(),new ColorMatrixImageFiltersPackage());
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
