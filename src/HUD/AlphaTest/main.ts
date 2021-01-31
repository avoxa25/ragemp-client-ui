import { RemoteResponse } from '../../Constants/remote-response';
import { DummyEntitiesConstants } from '../../Constants/dummy-entities.constants';

class AlphaTest {
  constructor() {
    const browser = mp.browsers.new('package://HUD/AlphaTest/alpha-test.html');

    const serverVersionDummyEntity = mp.dummies.toArray().find(d => d.id === DummyEntitiesConstants.ServerId) as DummyEntityMp;
    const serverVersion = serverVersionDummyEntity.getVariable('Version');
    browser.execute(`window.alphaTestUi.SetServerVersion('${serverVersion}');`);
  }
}

let alphaTest: AlphaTest | undefined;
mp.events.add(RemoteResponse.LoginAllowed, () => alphaTest = alphaTest ? alphaTest : new AlphaTest());