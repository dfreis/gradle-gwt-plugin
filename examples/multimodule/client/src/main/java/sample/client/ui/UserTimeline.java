package sample.client.ui;

import sample.support.mvp.View;

/**
 *
 */
public interface UserTimeline extends View<UserTimeline.Listener>{

    interface Listener {
        void refreshTimeline();
    }


}
