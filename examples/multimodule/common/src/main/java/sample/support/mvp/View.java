package sample.support.mvp;

import com.google.gwt.user.client.ui.Widget;

/**
 *
 */
public interface View<L> {

    void setListener(L listener);

    Widget asWidget();

}
