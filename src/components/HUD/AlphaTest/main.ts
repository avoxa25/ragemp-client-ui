import { RemoteResponse } from '../../../models/enums/events/remote-response';
import { DummyEntityConstants } from '../../../constants/dummy-entity';

class AlphaTest {
  constructor() {
    const browser = mp.browsers.new('package://components/HUD/AlphaTest/alpha-test.html');

    const serverVersionDummyEntity = mp.dummies.toArray().find(d => d.id === DummyEntityConstants.ServerId) as DummyEntityMp;
    const serverVersion = serverVersionDummyEntity.getVariable('Version');
    browser.execute(`window.alphaTestUi.SetServerVersion('${serverVersion}');`);
  }
}

let alphaTest: AlphaTest | undefined;
mp.events.add(RemoteResponse.LoginAllowed, () => alphaTest = alphaTest ? alphaTest : new AlphaTest());