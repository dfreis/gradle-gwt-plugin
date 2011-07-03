package sample.support.mvp;

import com.google.gwt.event.shared.HandlerManager;

/**
 *
 */
public interface Activity {

    interface Display {
        void displayView(View view);
    }

    void start(Display display, HandlerManager eventBus);

    void onStop();

}
