package sample.client;

import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.inject.client.AbstractGinModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import sample.support.mvp.Activity;
import sample.support.mvp.View;

/**
 *
 */
public class UiModule extends AbstractGinModule {

    @Override
    protected void configure() {
    }

    @Provides
    @Singleton @Named("primaryEventBus") @SuppressWarnings("unused")
    public HandlerManager primaryEventBus() {
        return new HandlerManager(null);
    }

    private <V extends View> void bindActivityAndView(Class<? extends Activity> activity,
                                                      Class<V> view,
                                                      Class<? extends V> viewImpl) {

        bind(activity).in(Singleton.class);
        bind(view).to(viewImpl).in(Singleton.class);

    }

}
