"""Original procedural sound effects. Standard library only; no samples or voice."""
from pathlib import Path
import math, random, wave, struct, json, hashlib, shutil
P=Path(__file__).resolve().parent; SR=44100; rng=random.Random(12112026)
def env(t,d,a=.012,r=.09): return min(1,t/a)*min(1,max(0,(d-t)/r))
def render(name,d,peak,fn):
 a=[fn(i/SR,d)*env(i/SR,d) for i in range(round(d*SR))]; m=max(abs(v) for v in a) or 1; a=[v*peak/m for v in a]
 f=P/'sfx'/f'{name}.wav'; pcm=b''.join(struct.pack('<h',round(v*32767)) for v in a)
 with wave.open(str(f),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm)
 rms=math.sqrt(sum(v*v for v in a)/len(a));return a,{'file':f'sfx/{name}.wav','duration_seconds':len(a)/SR,'sample_rate':SR,'channels':1,'peak_linear':max(abs(v) for v in a),'peak_dbfs':20*math.log10(peak),'rms_dbfs':20*math.log10(rms),'clipped_samples':sum(abs(v)>=1 for v in a),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}
def sine(f,t):return math.sin(2*math.pi*f*t)
def wood(t,d):return (sine(190,t)+.35*sine(417,t)+.15*sine(680,t))*math.exp(-t*30)
def bell(t,d):return (sine(440,t)+.28*sine(660,t)+.10*sine(890,t))*math.exp(-t*5)
def sparkle(t,d):return sum(.5**i*sine(f,t)*math.exp(-max(0,t-i*.06)*5)*(t>=i*.06) for i,f in enumerate([392,494,587]))
def noise_fn(cutoff):
 state=[0.0]
 def f(t,d):state[0]+=(rng.uniform(-1,1)-state[0])*cutoff;return state[0]
 return f
noise=noise_fn(.055)
def whoosh(t,d):return noise(t,d)*math.sin(math.pi*t/d)**1.4
spec=[('ui-wood-tap',.20,.12,wood),('door-ring',.68,.16,lambda t,d:.65*wood(t,d)+.4*sine(330,t)*math.exp(-t*6)+.12*sine(620,t)*math.exp(-t*8)),('magic-chime',1.10,.13,sparkle),('wood-flip',.12,.055,lambda t,d:wood(t,d)*.8+noise(t,d)*math.exp(-t*45)),('elf-bell',.82,.13,lambda t,d:bell(t,d)+.45*bell(max(0,t-.18),d)*(t>=.18)),('snow-puff',.45,.11,lambda t,d:whoosh(t,d)*.7+.2*sine(165+90*math.sin(t*9),t)*math.exp(-t*8)),('intro-arrival',1.30,.15,lambda t,d:.35*sine(196,t)+.24*sine(294,t)+.17*sine(392,t)+.3*sparkle(t,d)),('throw-whoosh',.55,.12,whoosh),('disco-shimmer',.95,.13,lambda t,d:(.4*sine(392,t)+.25*sine(494,t)+.15*sine(587,t))*(.7+.3*math.sin(2*math.pi*7*t))*math.exp(-t*2.5)),('title-bloom',1.45,.15,lambda t,d:(.4*sine(196,t)+.3*sine(294,t)+.2*sine(392,t))*math.sin(math.pi*t/d))]
rows=[];preview=[0.0]*int(.3*SR)
for name,d,peak,fn in spec:
 a,rec=render(name,d,peak,fn);rows.append(rec);preview+=a+[0.0]*int(.45*SR)
with wave.open(str(P/'sfx-preview.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in preview))
# Keep separately verified AAC derivatives; this script must never overwrite music.
tracks=json.loads((P/'audio-manifest.json').read_text())['music']
(P/'audio-manifest.json').write_text(json.dumps({'music':tracks,'sfx':rows,'preview':'sfx-preview.wav','method':'Original deterministic mathematical synthesis; no external samples or voice imitation. Files have fades and headroom; runtime gain further reduces loudness.'},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'music_files':len(tracks),'sfx_files':len(rows),'preview_seconds':len(preview)/SR,'all_zero_clipping':all(x['clipped_samples']==0 for x in rows)}))
