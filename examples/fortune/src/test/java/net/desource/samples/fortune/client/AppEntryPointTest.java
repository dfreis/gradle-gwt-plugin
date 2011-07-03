package net.desource.samples.fortune.client;

import com.google.gwt.junit.client.GWTTestCase;

/**
 *
 */
public class AppEntryPointTest extends GWTTestCase {

    @Override
    public String getModuleName() {
        return "net.desource.samples.fortune.AppTest";
    }

    public void testInitApplication() {

        AppEntryPoint entryPoint = new AppEntryPoint();
        entryPoint.onModuleLoad();

        AppEntryPoint.factory.getApp().revealFortune();


    }

}
