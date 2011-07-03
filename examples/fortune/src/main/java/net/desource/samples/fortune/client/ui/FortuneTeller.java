package net.desource.samples.fortune.client.ui;

import com.google.gwt.user.client.ui.Widget;
import net.desource.samples.fortune.client.Fortune;

/**
 *
 */
public interface FortuneTeller {

    public interface Listener {
        void revealFortune();
    }

    public void setListener(Listener listener);

    public void updateFortune(Fortune fortune);

    public Widget asWidget();

}
